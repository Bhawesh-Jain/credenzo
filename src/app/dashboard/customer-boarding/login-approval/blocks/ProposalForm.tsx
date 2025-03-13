'use client';

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  UserIcon, 
  HomeIcon, 
  BriefcaseIcon, 
  LandmarkIcon,
  CalendarIcon,
  WalletCardsIcon
} from "lucide-react"
import { ProposalFormValues } from "../../create-proposal/page";

export default function ProposalApproval({ proposal }: { proposal: ProposalFormValues }) {
  return (
    <Container>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Loan Proposal Review
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-semibold text-gray-600">
              {proposal.firstName} {proposal.lastName}
            </span>
            <Badge variant="outline" className="border-primary text-primary">
              Under Review
            </Badge>
          </div>
        </div>
        <Button variant="outline">
          Back to List
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Personal Details Card */}
        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              <span>Applicant Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailItem label="Full Name" value={`${proposal.firstName} ${proposal.lastName}`} />
            <DetailItem label="Contact" value={`${proposal.phone} • ${proposal.email}`} />
            <DetailItem label="PAN Number" value={proposal.panCard} />
            <DetailItem label="Gender" value={proposal.gender} />
            <DetailItem label="Date of Birth" value={proposal.dob.toLocaleDateString()} />
          </CardContent>
        </Card>

        {/* Address Details Card */}
        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <HomeIcon className="w-5 h-5 text-primary" />
              <span>Address Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Address Lines</p>
              <p className="text-sm text-muted-foreground">
                {proposal.add_line_1}<br />
                {proposal.add_line_2 && <>{proposal.add_line_2}<br /></>}
                {proposal.add_line_3 && <>{proposal.add_line_3}<br /></>}
                Landmark: {proposal.landmark}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Pincode" value={proposal.pincode} />
              <DetailItem label="City" value={proposal.city} />
              <DetailItem label="State" value={proposal.state} />
              <DetailItem label="Ownership" value={proposal.ownership} />
              {proposal.since && <DetailItem label="Residing Since" value={proposal.since} />}
            </div>
          </CardContent>
        </Card>

        {/* Income & Loan Details Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Income Card */}
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5 text-primary" />
                <span>Income Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid gap-4">
              <DetailItem label="Employment Type" value={proposal.empType} />
              <DetailItem label="Entity Name" value={proposal.entityName} />
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Monthly Income" value={`₹${proposal.incomeAmount}`} />
                <DetailItem label="Contact Number" value={proposal.incomeContact} />
              </div>
              <DetailItem label="Office Address" value={proposal.incomeAddress} />
            </CardContent>
          </Card>

          {/* Loan Card */}
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <LandmarkIcon className="w-5 h-5 text-primary" />
                <span>Loan Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <DetailItem label="Loan Product" value={proposal.productType} />
                <DetailItem label="Loan Purpose" value={proposal.purpose} />
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Requested Amount" value={`₹${proposal.loanAmount}`} />
                  <DetailItem label="Associated Branch" value={proposal.branch} />
                </div>
              </div>
              
              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Credit Score</span>
                  <Badge variant="outline" className="border-green-600 text-green-600">
                    750 (Good)
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Risk Rating</span>
                  <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                    Medium
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Footer */}
        <div className="flex justify-end gap-4 mt-8 border-t pt-6">
          <Button variant="destructive" size="lg">
            Reject Proposal
          </Button>
          <Button size="lg">
            Approve Loan
          </Button>
        </div>
      </div>
    </Container>
  )
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  )
}