#!/bin/bash
echo "Setting up backend structure..."

# Create directories
mkdir -p src/{controllers,models,routes,middleware,config,utils,services,types}
mkdir -p src/models/schemas
mkdir -p src/controllers/{auth,chat,user}
mkdir -p src/middleware/{auth,validation}
mkdir -p src/utils/{validators,helpers}

# Create files
touch package.json tsconfig.json .env .gitignore Dockerfile docker-compose.yml
touch src/index.ts src/config/database.ts src/config/server.ts
touch src/models/{User,ChatRoom,Message,PrivateChat,SupportTicket}.ts
touch src/models/schemas/{userSchema,chatSchema}.ts
touch src/controllers/auth/authController.ts
touch src/controllers/chat/chatController.ts
touch src/controllers/user/userController.ts
touch src/routes/{authRoutes,chatRoutes,userRoutes,index}.ts
touch src/middleware/auth/{authMiddleware,jwtMiddleware}.ts
touch src/middleware/validation/validationMiddleware.ts
touch src/middleware/errorHandler.ts
touch src/utils/validators/{authValidators,chatValidators}.ts
touch src/utils/helpers/{passwordUtils,jwtUtils,responseUtils}.ts
touch src/services/{userService,chatService,authService}.ts
touch src/types/{express.d.ts,user.ts,chat.ts}
touch src/migrations/00{1,2,3,4}_create_*_table.sql

echo "Backend structure created successfully!"
echo "Run: cd backend && npm install"
