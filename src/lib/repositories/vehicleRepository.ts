import { VehicleFormValues } from "@/app/dashboard/settings/deveshi-test/blocks/CreateVehicle";
import { EditVehicleFormValues } from "@/app/dashboard/settings/deveshi-test/blocks/EditVehicle";
import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from "mysql2/promise"


export class VehicleRepository extends RepositoryBase {
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.companyId = companyId;
  }

  async getVehiclesData() {
    try {
      const result = await new QueryBuilder('vehicles')
        .select()

      if (result.length > 0) {
        return this.success(result)
      }

      return this.failure("No Vehicle Found!")

    } catch (error) {
      return this.handleError(error);
    }
  }



  async getVehicleById(vehicleId: number) {
    try {

      var sql = `
          SELECT *
          FROM vehicles
          WHERE id = ?
          LIMIT 1;
           `

      const result = await executeQuery(sql, [vehicleId]) as any[]

      if (result.length > 0) {
        return this.success(result[0])
      }

      return this.failure("No Vehicles Found!")
    } catch (error) {
      return this.handleError(error);
      
    }
  }


    async getVehicleCompany() {
    try {

      var sql = `
          SELECT DISTINCT company
          FROM vehicles
           `

      const result = await executeQuery(sql) as any[]

      if (result.length > 0) {
        return this.success(result)
      }

      return this.failure("No Vehicle Company Found!")
    } catch (error) {
     
      return this.handleError(error);
      
    }
  }

  async editVehicle(vehicleId: number, vehicle: EditVehicleFormValues) {
    try {
      const result = await new QueryBuilder('vehicles')
        .where("id = ?", vehicleId)
        // .where("company_id = ?", this.companyId)
        .update(vehicle)

      if (result > 0) {
        return this.success("Vehicle Updated")
      }

      return this.failure("Vehicle Not Found!")
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createVehicle(
    userId: string,
    vehicleData: VehicleFormValues,
    transactionConnection?: mysql.Connection
  ) {
    try {
      const vehicle = {
        ...vehicleData,
        added_by: userId
      }

      const result = await new QueryBuilder('vehicles')
        .setConnection(transactionConnection)
        .insert(vehicle);

      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }

}