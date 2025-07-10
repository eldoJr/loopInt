"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
let AuthController = class AuthController {
    async register(body) {
        const { email, password, name } = body;
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const now = new Date();
            const result = await pool.query('INSERT INTO users (id, email, password, name, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING id, email, name, role, avatar_url, created_at, updated_at', [email, hashedPassword, name, now, now]);
            return result.rows[0];
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.HttpException('Email already exists', common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException('Registration failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(body) {
        const { email, password } = body;
        try {
            const result = await pool.query('SELECT id, email, password, name, role, avatar_url, created_at, updated_at FROM users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
            const user = result.rows[0];
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Login failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async test() {
        return {
            message: 'API is working',
            timestamp: new Date(),
            dbUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
        };
    }
    async googleCallback(code, error, res) {
        console.log('Google callback received:', { code: !!code, error });
        if (error || !code) {
            console.error('OAuth error or missing code:', error);
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_cancelled`);
        }
        try {
            const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: '1075897717707-l6udtbgag9u2plju9gfu9kaljvq7ouki.apps.googleusercontent.com',
                    client_secret: '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',
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: `${process.env.API_URL || 'http://localhost:3000'}/api/auth/google/callback`
                })
            });
            const tokens = await tokenResponse.json();
            console.log('Token response:', { hasAccessToken: !!tokens.access_token, error: tokens.error });
            if (tokens.error) {
                console.error('Token exchange error:', tokens.error);
                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=token_failed`);
            }
            const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`);
            const googleUser = await userResponse.json();
            console.log('Google user:', { email: googleUser.email, name: googleUser.name });
            if (!googleUser.email) {
                console.error('No email from Google user');
                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_email`);
            }
            let result = await pool.query('SELECT id, email, name, role, avatar_url, created_at, updated_at FROM users WHERE email = $1', [googleUser.email]);
            let user;
            if (result.rows.length === 0) {
                const now = new Date();
                const insertResult = await pool.query('INSERT INTO users (id, email, password, name, avatar_url, role, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7) RETURNING id, email, name, role, avatar_url, created_at, updated_at', [googleUser.email, '', googleUser.name || googleUser.email.split('@')[0], googleUser.picture, 'user', now, now]);
                user = insertResult.rows[0];
                console.log('Created new user:', user.email);
            }
            else {
                if (googleUser.picture && result.rows[0].avatar_url !== googleUser.picture) {
                    await pool.query('UPDATE users SET avatar_url = $1, updated_at = $2 WHERE email = $3', [googleUser.picture, new Date(), googleUser.email]);
                    result.rows[0].avatar_url = googleUser.picture;
                }
                user = result.rows[0];
                console.log('Found existing user:', user.email);
            }
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?user=${encodeURIComponent(JSON.stringify(user))}`);
        }
        catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "test", null);
__decorate([
    (0, common_1.Get)('auth/google/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('error')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api')
], AuthController);
//# sourceMappingURL=auth.controller.js.map