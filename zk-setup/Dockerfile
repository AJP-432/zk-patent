# Use a specific Node.js version for reproducibility
FROM node:18-slim

# Install necessary dependencies for circom and snarkjs
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Rust (required to build circom)
RUN wget https://sh.rustup.rs/rustup-init.sh -O rustup-init.sh && \
    sh rustup-init.sh -y --default-toolchain stable && \
    rm rustup-init.sh
ENV PATH="/root/.cargo/bin:${PATH}"

# Install circom from source
RUN git clone https://github.com/iden3/circom.git && \
    cd circom && \
    cargo build --release && \
    cp target/release/circom /usr/local/bin/

# Install snarkjs and pnpm globally
RUN npm install -g snarkjs pnpm

# Set the working directory
WORKDIR /app

# Copy dependency files and install project dependencies
# This is done before copying all files to leverage Docker's layer caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy your project files into the container
COPY . .

# Set a command to keep the container running if needed, or just for exec
CMD ["tail", "-f", "/dev/null"]