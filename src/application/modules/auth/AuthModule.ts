import AuthProxyController from "@/application/controller/auth/AuthProxyController";
import AuthProxyUseCase from "@/application/usecase/auth/AuthProxyUseCase";
import BcryptHashManagerAdapter from "@/infrastructure/hash/bcrypt/BcryptHashManagerAdapter";
import JwtTokenManagerAdapter from "@/infrastructure/jsonwebtoken/JwtTokenManagerAdapter";
import MemoryAuthKeyRepository from "@/infrastructure/repository/memory/MemoryAuthKeyRepository";

const jwtTokenManager = new JwtTokenManagerAdapter();
const bcryptHashManager = new BcryptHashManagerAdapter();
const memoryRepository = new MemoryAuthKeyRepository(bcryptHashManager);
const authProxyUseCase = new AuthProxyUseCase(memoryRepository, jwtTokenManager);

export default new AuthProxyController(authProxyUseCase);