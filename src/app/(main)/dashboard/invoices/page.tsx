import { InvoiceList } from "./_components/invoice-list";

export default function InvoicesPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <InvoiceList />
    </div>
  );
}
