import { jsPDF } from 'jspdf';
import { formatDate, formatMoney } from './data.mjs';

const text = value => String(value ?? '').replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
export function createSampleInvoice(invoice, account) {
  if (!invoice.id?.startsWith('TF-DEMO-') || invoice.status !== 'paid' || !Number.isSafeInteger(invoice.amountMinor) || invoice.amountMinor < 0) {
    throw new Error('Only paid sample invoices can be generated in this preview.');
  }
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const purple = '#6d28d9', ink = '#2e1065', muted = '#705b8c', line = '#e5d8fa';
  doc.setProperties({ title: `Sample invoice ${text(invoice.id)}`, subject: 'Tru Fit portal demonstration - not a tax invoice', author: 'Tru Fit' });
  doc.setFillColor(purple); doc.rect(0, 0, 210, 49, 'F');
  doc.setTextColor('#ffffff'); doc.setFont('helvetica', 'bold'); doc.setFontSize(28); doc.text('tru fit', 20, 24);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text('A HUMAN IN YOUR CORNER', 20, 35);
  doc.setFontSize(11); doc.text('SAMPLE INVOICE', 190, 24, { align: 'right' });
  doc.setFontSize(9); doc.text(text(invoice.id), 190, 35, { align: 'right' });
  doc.setTextColor(ink); doc.setFont('helvetica', 'bold'); doc.setFontSize(23); doc.text('Your coaching. All accounted for.', 20, 70);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(muted); doc.text('Sample document - not valid for payment or tax purposes.', 20, 81);
  doc.setTextColor(purple); doc.setFontSize(9); doc.text('BILLED TO', 20, 101); doc.text('PAYMENT DETAILS', 119, 101);
  doc.setTextColor(ink); doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text(text(account.name), 20, 112); doc.text('PAID (DEMO)', 119, 112);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(muted);
  doc.text(text(account.email), 20, 121); doc.text(`Issued: ${formatDate(invoice.issuedAt)}`, 119, 121);
  doc.text(`Member: ${text(account.memberId)}`, 20, 130); doc.text(`Paid: ${formatDate(invoice.paidAt)}`, 119, 130);
  doc.setDrawColor(line); doc.line(20, 144, 190, 144);
  doc.setFontSize(9); doc.setTextColor(purple); doc.text('DESCRIPTION', 20, 157); doc.text('AMOUNT', 190, 157, { align: 'right' });
  doc.setFontSize(11); doc.setTextColor(ink);
  doc.text(doc.splitTextToSize(text(invoice.description), 112), 20, 170);
  const amount = formatMoney(invoice.amountMinor, invoice.currency).replace('₹', 'INR ');
  doc.text(text(amount), 190, 170, { align: 'right' });
  doc.line(20, 185, 190, 185);
  doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.text('Total paid', 20, 200); doc.text(text(amount), 190, 200, { align: 'right' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(muted);
  doc.text(`Payment method: ${text(invoice.method)}`, 20, 220); doc.text(`Reference: ${text(invoice.reference)}`, 20, 229);
  doc.setDrawColor(line); doc.line(20, 256, 190, 256);
  doc.setFontSize(9); doc.text('Questions? support@betrufit.com', 20, 267);
  doc.text('This sample uses fictional customer and payment details.', 20, 275);
  doc.text('1 / 1', 190, 275, { align: 'right' });
  return doc;
}
