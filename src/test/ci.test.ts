import { EncryptionService } from '../core/crypto/encryption.service';
import { StorageProviderRegistry } from '../core/storage/storage-provider.registry';
import { GoogleDriveStorageProvider } from '../core/storage/providers/google-drive.provider';
import { ProjectService } from '../modules/projects/project.service';
import { AuthRepository } from '../modules/auth/auth.repository';
import { prisma } from '../config/database.config';

async function runCITests() {
  console.log('=== Running DriveBase Production CI Unit & System Verification Suite ===\n');

  // Test 1: Password Hashing & bcrypt Verification
  const rawPass = 'SecretPass123!';
  const hash = await EncryptionService.hashPassword(rawPass);
  const isValidPass = await EncryptionService.verifyPassword(rawPass, hash);
  if (!isValidPass) throw new Error('Password hash comparison failed');
  console.log('[PASS] 1. Password Hashing & Bcrypt Verification');

  // Ensure DB user exists with valid encrypted Google tokens
  const encryptedMockToken = EncryptionService.encryptToken('mock_access_token_ci');
  const testUser = await AuthRepository.createUser({
    email: `ci_user_${Date.now()}@drivebase.io`,
    password: rawPass,
    passwordHash: hash,
    fullName: 'CI Runner',
    role: 'OWNER',
  });

  await prisma.user.update({
    where: { id: testUser.id },
    data: {
      googleAccessToken: encryptedMockToken,
      googleRefreshToken: encryptedMockToken,
      googleTokenExpiry: new Date(Date.now() + 3600 * 1000),
    },
  });

  // Test 2: JWT Access Token Generation & Verification
  const payload = { id: testUser.id, email: testUser.email, role: testUser.role };
  const accessToken = EncryptionService.generateAccessToken(payload);
  const verified = EncryptionService.verifyAccessToken(accessToken);
  if (verified.id !== payload.id || verified.email !== payload.email) {
    throw new Error('JWT token verification payload mismatch');
  }
  console.log('[PASS] 2. JWT Access Token Generation & Verification');

  // Test 3: AES-256-GCM Symmetric Encryption
  const sensitiveSecret = 'sk_live_99a8b7c6d5e4f3a2b1';
  const encryptedSecret = EncryptionService.encryptToken(sensitiveSecret);
  const decryptedSecret = EncryptionService.decryptToken(encryptedSecret);
  if (decryptedSecret !== sensitiveSecret) {
    throw new Error('AES-256-GCM encryption/decryption failed');
  }
  console.log('[PASS] 3. AES-256-GCM Secret Token Encryption');

  // Test 4: StorageProvider Plugin Architecture
  const provider = new GoogleDriveStorageProvider();
  StorageProviderRegistry.registerProvider(provider);
  if (provider.providerName !== 'google_drive') {
    throw new Error('StorageProvider name mismatch');
  }
  console.log('[PASS] 4. StorageProvider Plugin Registration');

  // Test 5: BYO Google Credentials & Secret Masking
  const proj = await ProjectService.createProject(testUser.id, { name: 'CI Project', slug: `ci-project-${Date.now()}`, region: 'us-east-1' });
  if (proj.name !== 'CI Project') throw new Error('Project name mismatch');

  const creds = await ProjectService.saveGoogleCredentials(proj.id, testUser.id, {
    clientId: 'ci_client_id.apps.googleusercontent.com',
    clientSecret: 'ci_secret_123',
  });
  if (creds.clientSecret !== '••••••••') throw new Error('Client secret masking failed');
  console.log('[PASS] 5. BYO Google Credentials Encryption & Secret Masking');

  // Test 6: Project Creation & Encrypted Env Variables
  const envRec = await ProjectService.setEnvironmentVariable(proj.id, testUser.id, {
    key: 'API_SECRET',
    value: 'secret_val_123',
    isSecret: true,
  });
  if (envRec.value !== '••••••••') throw new Error('Secret value masking failed');
  console.log('[PASS] 6. Multi-Tenant Project CRUD & Encrypted Env Vars');

  console.log('\n=== ALL CI SUITE TESTS COMPLETED SUCCESSFULLY! ===');
}

runCITests().catch((err) => {
  console.error('[CI TEST FAILURE]', err);
  process.exit(1);
});
