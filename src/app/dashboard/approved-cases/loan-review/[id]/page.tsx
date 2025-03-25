'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Container } from "@/components/ui/container";
// import { getLoanDetails } from "@/lib/actions/loan-details"; 

import TeleverificationTab from "./blocks/TeleverificationTab";
import BankingTab from "./blocks/BankingTab";
import CashFlowTab from "./blocks/CashFlowTab";
import EnquiryTab from "./blocks/EnquiryTab";
import FinalReviewTab from "./blocks/FinalReviewTab";
import { Heading } from "@/components/text/heading";

export default function LoanReviewPage() {

  const { id } = useParams() as { id: string };

  const [loanDetails, setLoanDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLoanDetails() {
      try {
        // const data = await getLoanDetails(id);
        setLoanDetails({});
      } catch (error) {
        setError("Error fetching loan details");
      } finally {
        setLoading(false);
      }
    }
    fetchLoanDetails();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <div className="py-8 text-center">Loading loan details...</div>
      </Container>
    );
  }

  if (!loanDetails) {
    return (
      <Container>
        <div className="py-8 text-center text-red-500">No loan details found.</div>
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <div className="py-8 text-center text-red-500">{error}</div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <Tabs defaultValue="televerification">
          <TabsList className="mb-4">
            <TabsTrigger value="televerification">Televerification</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="enquiry">Additional Enquiry</TabsTrigger>
            <TabsTrigger value="final">Final Review</TabsTrigger>
          </TabsList>
          <TabsContent value="televerification">
            <TeleverificationTab loanDetails={loanDetails} />
          </TabsContent>
          <TabsContent value="banking">
            <BankingTab loanDetails={loanDetails} />
          </TabsContent>
          <TabsContent value="cashflow">
            <CashFlowTab loanDetails={loanDetails} />
          </TabsContent>
          <TabsContent value="enquiry">
            <EnquiryTab loanDetails={loanDetails} />
          </TabsContent>
          <TabsContent value="final">
            <FinalReviewTab loanDetails={loanDetails} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
