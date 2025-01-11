# Step 1: Install development dependencies
FROM node:23-alpine AS development-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Step 2: Install production dependencies (omit dev dependencies)
FROM node:23-alpine AS production-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --omit=dev

# Step 3: Build the application
FROM node:23-alpine AS build-env
WORKDIR /app
COPY . ./
COPY --from=development-dependencies-env /app/node_modules ./node_modules
RUN npm run build

# Step 4: Final production image
FROM node:23-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build

# Make sure cross-env is installed for production if needed
RUN npm install cross-env --save-dev --legacy-peer-deps

# Set environment variable for production build
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
