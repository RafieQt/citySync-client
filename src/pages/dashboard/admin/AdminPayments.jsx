import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../utils/axiosSecure";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Download } from "lucide-react";


const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  title: { fontSize: 22, marginBottom: 20, fontWeight: "bold" },
  section: { marginBottom: 10 },
  label: { fontWeight: "bold" },
  amount: { marginTop: 20, fontSize: 18, fontWeight: "bold" },
});

const InvoicePDF = ({ payment }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>CitySync Invoice</Text>

      <View style={styles.section}>
        <Text>
          <Text style={styles.label}>Transaction ID: </Text>
          {payment.transactionId}
        </Text>
      </View>

      <View style={styles.section}>
        <Text>
          <Text style={styles.label}>User: </Text>
          {payment.userEmail}
        </Text>
      </View>

      <View style={styles.section}>
        <Text>
          <Text style={styles.label}>Payment Type: </Text>
          {payment.type}
        </Text>
      </View>

      <View style={styles.section}>
        <Text>
          <Text style={styles.label}>Issue: </Text>
          {payment.issueTitle || "N/A"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text>
          <Text style={styles.label}>Date: </Text>
          {new Date(payment.createdAt).toLocaleString()}
        </Text>
      </View>

      <Text style={styles.amount}>
        Amount Paid: {payment.amount} BDT
      </Text>
    </Page>
  </Document>
);

const AdminPayments = () => {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["allPayments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  const total = payments.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  return (
    <div className="w-full overflow-x-hidden">
   
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-heading)" }}>
          Payments
        </h1>

        <div className="badge badge-lg p-4 w-fit" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-bg)" }}>
          Total Revenue: ৳{total}
        </div>
      </div>

     
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-16 cs-surface text-gray-400">
          No payments yet.
        </div>
      ) : (
        <>
          
          {/* for DESKTOP TABLE */}
         

          <div className="hidden lg:block">
            <div className="overflow-x-auto cs-surface">
              <table className="table">
                <thead>
                  <tr style={{ backgroundColor: "var(--color-surface-hover)", color: "var(--color-text-heading)" }}>
                    <th>Transaction ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Issue</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Invoice</th>
                  </tr>
                </thead>

                <tbody style={{ color: "var(--color-text-body)" }}>
                  {payments.map((p) => (
                    <tr key={p._id} className="hover" style={{ borderColor: "var(--color-border)" }}>
                      <td className="text-xs font-mono max-w-[140px] truncate" style={{ color: "var(--color-text-muted)" }}>
                        {p.transactionId}
                      </td>

                      <td className="text-xs max-w-[180px] truncate" style={{ color: "var(--color-text-body)" }}>
                        {p.userEmail}
                      </td>

                      <td>
                        <span
                          className={`badge badge-sm capitalize ${
                            p.type === "boost"
                              ? "badge-warning"
                              : "badge-info"
                          }`}
                        >
                          {p.type}
                        </span>
                      </td>

                      <td className="text-xs max-w-[180px] truncate" style={{ color: "var(--color-text-muted)" }}>
                        {p.issueTitle || "—"}
                      </td>

                      <td className="font-bold" style={{ color: "var(--color-text-heading)" }}>
                        ৳{p.amount}
                      </td>

                      <td className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>

                      <td>
                        <PDFDownloadLink
                          document={<InvoicePDF payment={p} />}
                          fileName={`invoice-${p.transactionId}.pdf`}
                        >
                          {({ loading }) => (
                            <button className="btn btn-sm px-2 rounded-xl border-none" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-bg)" }}>
                              <Download size={16} />
                              {loading ? "Generating..." : "Invoice"}
                            </button>
                          )}
                        </PDFDownloadLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================= */}
          {/* MOBILE CARDS */}
          {/* ========================= */}

          <div className="lg:hidden flex justify-center">
            <div className="w-full max-w-md space-y-4">
              {payments.map((p) => (
                <div
                  key={p._id}
                  className="cs-surface p-4"
                >
                  {/* TOP */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] uppercase font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                        Transaction ID
                      </p>

                      <p className="text-xs font-mono break-all" style={{ color: "var(--color-text-body)" }}>
                        {p.transactionId}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                        User
                      </p>

                      <p className="text-sm break-all" style={{ color: "var(--color-text-heading)" }}>
                        {p.userEmail}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`badge badge-sm capitalize ${
                          p.type === "boost"
                            ? "badge-warning"
                            : "badge-info"
                        }`}
                      >
                        {p.type}
                      </span>

                      <span className="badge badge-sm badge-ghost">
                        ৳{p.amount}
                      </span>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                        Issue
                      </p>

                      <p className="text-sm break-words" style={{ color: "var(--color-text-body)" }}>
                        {p.issueTitle || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                        Date
                      </p>

                      <p className="text-sm" style={{ color: "var(--color-text-body)" }}>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* DOWNLOAD */}
                  <div className="mt-5">
                    <PDFDownloadLink
                      document={<InvoicePDF payment={p} />}
                      fileName={`invoice-${p.transactionId}.pdf`}
                      className="w-full"
                    >
                      {({ loading }) => (
                        <button className="btn w-full rounded-xl border-none" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-bg)" }}>
                          <Download size={18} />
                          {loading ? "Generating Invoice..." : "Download Invoice"}
                        </button>
                      )}
                    </PDFDownloadLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPayments;