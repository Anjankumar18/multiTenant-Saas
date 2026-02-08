/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,action]` on the table `Usage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Usage_tenantId_action_key" ON "Usage"("tenantId", "action");
