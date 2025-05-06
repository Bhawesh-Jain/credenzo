"use server"

import { CompanyRepository } from "../repositories/companyRepository";
import { getSession } from "../session";

export async function getCompanyDetails() {
    const session = await getSession();

    const companyRepository = new CompanyRepository(session.company_id);
    const result = await companyRepository.getCompanyDetails();

    return result;
}