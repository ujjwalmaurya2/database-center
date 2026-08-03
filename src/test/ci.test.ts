import { EncryptionService } from '../core/crypto/encryption.service';
import { StorageProviderRegistry } from '../core/storage/storage-provider.registry';
import { GoogleDriveStorageProvider } from '../core/storage/providers/google-drive.provider';
import { ProjectService } from '../modules/projects/project.service';
import { AuthRepository } from '../modules/auth/auth.repository';

async function runCITests() {
  console.log('=== Running DriveBase Production CI Unit & System Verification Suite ===\n');

  // Test 1: Password Hashing & bcrypt Verification
  const rawPass = 'SecretPass123!';
  const hash = await EncryptionService.hashPassword(rawPass);
  const isValidPass = await EncryptionService.verifyPassword(rawPass, hash);
  if (!isValidPass) throw new Error('Password hash comparison failed');
  console.log('[PASS] 1. Password Hashing & Bcrypt Verification');

  // Ensure DB user exists for foreign key relations
  const testUser = await AuthRepository.createUser({
    email: `ci_user_${Date.now()}@drivebase.io`,
    password: rawPass,
    passwordHash: hash,
    fullName: 'CI Runner',
    role: 'OWNER',
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

  // Test 5: Google Drive App Folder Isolation & File Mock
  const uploaded = await provider.uploadFile(testUser.id, 'ci_doc.txt', Buffer.from('CI content'), 'text/plain');
  if (uploaded.name !== 'ci_doc.txt') throw new Error('Upload filename mismatch');
  const quota = await provider.getQuotaInfo(testUser.id);
  if (!quota.totalBytes || quota.totalBytes <= 0) throw new Error('Quota info calculation error');
  console.log('[PASS] 5. Google Drive StorageProvider & Quota Metrics');

  // Test 6: Project Creation & Encrypted Env Variables
  const proj = await ProjectService.createProject(testUser.id, { name: 'CI Project', slug: `ci-project-${Date.now()}`, region: 'us-east-1' });
  if (proj.name !== 'CI Project') throw new Error('Project name mismatch');
  const envRec = await ProjectService.setEnvironmentVariable(proj.id, testUser.id, {
    key: 'API_SECRET',
    value: 'secret_val_123',
    isSecret: true,
  });
  if (envRec.value !== '••••••••') throw new Error('Secret value masking failed');
  console.log('[PASS] 6. Multi-Tenant Project CRUD & Secret Masking');

  console.log('\n=== ALL CI SUITE TESTS COMPLETED SUCCESSFULLY! ===');
}

runCITests().catch((err) => {
  console.error('[CI TEST FAILURE]', err);
  process.exit(1);
});
