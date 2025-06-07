import { DirectCollectionAccountValues } from "@/app/dashboard/settings/product-management/blocks/AddProduct";
import { executeQuery, QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";

export interface Product {
  name: string;
  type: string;
  minimum_cibil_score: number;
  maximum_tenure: number;
  minimum_tenure: number;
  age: number;
  interest_rate: number;
}
export class ProductRepository extends RepositoryBase {
  private queryBuilder: QueryBuilder;
  private userProductBuilder: QueryBuilder;
  private companyId: string;

  constructor(companyId: string) {
    super();
    this.queryBuilder = new QueryBuilder('loan_product_type');
    this.userProductBuilder = new QueryBuilder('entity_type');
    this.companyId = companyId;
  }
   async createProducts(
      userId: string,
      data: DirectCollectionAccountValues,
    ) {
      try {
        console.log('Data:-----', data);
        
       
    const result = await this.queryBuilder.insert({
      name: data.name,
      type: data.type,
      minimum_cibil_score: data.minimum_cibil_score,
      maximum_tenure: data.maximum_tenure,
      minimum_tenure: data.minimum_tenure,
      age: data.age,
      interest_rate: data.interest_rate,
      status: 1,
      company_id: this.companyId,
      updated_by: userId,
      updated_on: new Date(),
    });
  
        return this.success(result);
      } catch (error) {
        return this.handleError(error);
      }
    }
    async createProductsType(
      userId: string,
      data: String,
    ) {
      try {
        console.log('type:-----',data );
        
       
    const result = await this.userProductBuilder.insert({
      type: data,
      status: 1,
      company_id: this.companyId,
      updated_by: userId,
      updated_on: new Date(),
    });
  
        return this.success(result);
      } catch (error) {
        return this.handleError(error);
      }
    }
    async getProductsType(){
      try{
        const result = await this.userProductBuilder
         .where('company_id = ?', this.companyId)
        .select([ 'type','status']);

      console.log('Products:-----', result);
      if (result.length > 0) {
        return this.success(result);
      } else {
        return this.failure('No branches found');
      }
    } catch (error) {
      return this.handleError(error);
    }
    }
    async updateProducts(
        accountId: number,
        userId: string,
        data: Partial<DirectCollectionAccountValues>,
      ) {
        try {
          const updateData = {
            ...data,
            updated_by: userId,
          };
    
          const result = await this.queryBuilder
            .where("id = ?", accountId)
            .update(updateData);
    
          return this.success(result);
        } catch (error) {
          return this.handleError(error);
        }
      }
  async getProducts() {
    try {
      const result = await this.queryBuilder
        .where('company_id = ?', this.companyId)
        .select(['id', 'name', 'type','minimum_tenure','maximum_tenure','minimum_cibil_score','age','interest_rate','status', 'created_on']);

      console.log('Products:-----', result);
      if (result.length > 0) {
        return this.success(result);
      } else {
        return this.failure('No branches found');
      }
    } catch (error) {
      return this.handleError(error);
    }
  }


}
