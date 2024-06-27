-- CreateTable
CREATE TABLE "Reservation" (
    "reservationID" SERIAL NOT NULL,
    "fullname" VARCHAR(100) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "userID" INTEGER NOT NULL,
    "serviceID" INTEGER NOT NULL,
    "branchID" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("reservationID")
);

-- CreateTable
CREATE TABLE "Service" (
    "serviceID" SERIAL NOT NULL,
    "serviceName" VARCHAR(100) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "Branch" (
    "branchID" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "locationName" VARCHAR(100) NOT NULL,
    "openTime" VARCHAR(5) NOT NULL,
    "closeTime" VARCHAR(5) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("branchID")
);

-- CreateTable
CREATE TABLE "BranchService" (
    "branchID" INTEGER NOT NULL,
    "serviceID" INTEGER NOT NULL,

    CONSTRAINT "BranchService_pkey" PRIMARY KEY ("branchID","serviceID")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_branchID_fkey" FOREIGN KEY ("branchID") REFERENCES "Branch"("branchID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchService" ADD CONSTRAINT "BranchService_branchID_fkey" FOREIGN KEY ("branchID") REFERENCES "Branch"("branchID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchService" ADD CONSTRAINT "BranchService_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE RESTRICT ON UPDATE CASCADE;
