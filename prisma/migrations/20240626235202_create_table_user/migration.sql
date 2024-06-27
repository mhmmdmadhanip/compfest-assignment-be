-- CreateTable
CREATE TABLE "users" (
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "token" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);
