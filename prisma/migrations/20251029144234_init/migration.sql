-- CreateTable
CREATE TABLE "User" (
    "int_user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "var_email" TEXT NOT NULL,
    "var_first_name" TEXT NOT NULL,
    "var_last_name" TEXT NOT NULL,
    "date_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_var_email_key" ON "User"("var_email");
