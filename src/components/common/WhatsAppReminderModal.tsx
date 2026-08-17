import React, { useState } from 'react';
import { Student, Parent, FeePayment, FeeStructure, AcademicTerm } from '../../types';
import { SCHOOL_INFO } from '../../data/mockData';
import { formatGHS } from '../../utils/currency';
import { Modal } from './Modal';
import { toast } from './Toast';
import {
  MessageCircle,
  Send,
  Copy,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface WhatsAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
  parent?: Parent | null;
  feeDetails?: {
    totalBilled: number;
    totalPaid: number;
    arrears: number;
  } | null;
  activeTerm: AcademicTerm;
  allStudents?: Student[];
  allParents?: Parent[];
  allFeePayments?: FeePayment[];
  allFeeStructures?: FeeStructure[];
  mode?: 'single' | 'broadcast';
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  isOpen,
  onClose,
  student,
  parent,
  feeDetails,
  activeTerm,
  allStudents = [],
  allParents = [],
  allFeePayments = [],
  allFeeStructures = [],
  mode = 'single',
}) => {
  const [templateType, setTemplateType] = useState<'fee_reminder' | 'exam_schedule' | 'pta_meeting' | 'general'>(
    'fee_reminder'
  );
  const [customHeading, setCustomHeading] = useState('Official Term Notice');
  const [customMessage, setCustomMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'debtors' | 'all' | 'jhs'>('debtors');

  if (!isOpen) return null;

  // Clean phone number for WhatsApp wa.me link (stripping spaces, brackets, +)
  const formatPhoneForWhatsApp = (rawPhone: string) => {
    let clean = rawPhone.replace(/[\s\-\(\)\+]/g, '');
    if (clean.startsWith('0')) {
      clean = '233' + clean.substring(1);
    }
    if (!clean.startsWith('233') && clean.length === 9) {
      clean = '233' + clean;
    }
    return clean;
  };

  // Generate Personalized WhatsApp Message for Single Student / Parent
  const generateSingleMessage = () => {
    const parentName = parent?.fullName || student?.parentName || 'Esteemed Parent/Guardian';
    const wardName = student?.fullName || 'Your Ward';
    const className = student?.className || 'Class';
    const arrearsAmount = feeDetails ? formatGHS(feeDetails.arrears) : 'GH₵ 1,200.00';

    if (templateType === 'fee_reminder') {
      return `🇬🇭 *${SCHOOL_INFO.name.toUpperCase()} — FEE ARREARS NOTICE*
Dear ${parentName},

This is an official payment reminder from the Accounts Office regarding your ward *${wardName}* (${className}).

📊 *Fee Summary (${activeTerm}):*
• Outstanding Arrears: *${arrearsAmount}*
• Academic Year: *2025/2026*
• Payment Deadline: *Friday, 27th March 2026*

📱 *Official School MoMo Payment Channels:*
• *MTN MoMo Merchant / Shortcode:* 059 123 4567
• *Telecel Cash:* 020 987 6543
• *Reference:* ${wardName.split(' ')[0]} - ${className.split(' ')[0]}
• *Bank Deposit:* GCB Bank (Acc: 1091122334455)

Kindly send proof of transaction / MoMo SMS after payment. Please disregard if payment was completed in the last 24 hours.

Thank you,
*Accounts & Bursary Office*
${SCHOOL_INFO.name} • Tel: ${SCHOOL_INFO.phone}`;
    }

    if (templateType === 'exam_schedule') {
      return `🇬🇭 *${SCHOOL_INFO.name.toUpperCase()} — TRIMESTER EXAM TIMETABLE*
Dear ${parentName},

Please be informed that the *${activeTerm} End of Term Examination* for *${wardName}* (${className}) commences on *Monday, 30th March 2026*.

📚 *Reminders for Parents:*
1. Pupils must arrive at school by 7:30 AM in complete, neat school uniform.
2. Ensure pupils bring all required mathematical sets, HB pencils, and pens.
3. Fee clearance is required to receive the official Terminal Report Card.

Thank you for your partnership in academic excellence.
*Headteacher's Office* • ${SCHOOL_INFO.name}`;
    }

    if (templateType === 'pta_meeting') {
      return `🇬🇭 *${SCHOOL_INFO.name.toUpperCase()} — INVITATION TO PTA GENERAL MEETING*
Dear ${parentName},

You are cordially invited to the *Trimester General PTA Meeting* of Livine International School.

📅 *Date:* Saturday, 21st March 2026
⏰ *Time:* 9:00 AM Prompt
📍 *Venue:* School Main Assembly Hall (Ashale Botwe Lakeside Campus)
🎯 *Agenda:* Standards-Based NaCCA Curriculum implementation, BECE readiness, and facility upgrades.

Your presence and constructive contributions are highly valued.
*PTA Executive Committee & School Management*`;
    }

    return `🇬🇭 *${SCHOOL_INFO.name.toUpperCase()} — ANNOUNCEMENT*
Dear ${parentName} (Parent of ${wardName}),

${customMessage || 'Kindly take note of the upcoming school schedule and events for the current trimester.'}

Best regards,
*Management* • ${SCHOOL_INFO.name}`;
  };

  const messageText = generateSingleMessage();
  const targetPhone = parent?.phone || student?.parentPhone || '+233 24 498 7654';
  const waPhone = formatPhoneForWhatsApp(targetPhone);
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(messageText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    toast.success('WhatsApp message template copied to clipboard!');
  };

  const handleOpenWhatsApp = () => {
    window.open(waUrl, '_blank');
    toast.success(`Opening WhatsApp chat with ${targetPhone}...`);
  };

  // Helper to calculate arrears for all students
  const getDebtorsList = () => {
    return allStudents.map((s) => {
      let level: FeeStructure['classLevel'] = 'Upper Primary';
      if (s.className.includes('Nursery')) level = 'Nursery';
      else if (s.className.includes('KG')) level = 'KG';
      else if (s.className.includes('Basic 1') || s.className.includes('Basic 2') || s.className.includes('Basic 3')) level = 'Lower Primary';
      else if (s.className.includes('Basic 4') || s.className.includes('Basic 5') || s.className.includes('Basic 6')) level = 'Upper Primary';
      else if (s.className.includes('JHS')) level = 'JHS';

      const structure = allFeeStructures.find((f) => f.classLevel === level);
      const totalBilled = structure ? structure.totalFee : 3000;
      const totalPaid = allFeePayments
        .filter((p) => p.studentId === s.id && p.term === activeTerm)
        .reduce((sum, p) => sum + p.amountPaid, 0);
      const arrears = Math.max(0, totalBilled - totalPaid);

      return { student: s, totalBilled, totalPaid, arrears };
    }).filter((d) => d.arrears > 0);
  };

  const debtorsList = getDebtorsList();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'broadcast' ? 'Parent WhatsApp & SMS Broadcast Center' : 'Send WhatsApp Reminder to Parent'}
      subtitle="Livine International School Parent Communication & Debtors Notification"
      size="large"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top Header Card */}
        <div
          style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#10B981', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#065F46', fontSize: '0.95rem' }}>
                {mode === 'broadcast'
                  ? `Broadcasting to Parents (${debtorsList.length} Parents with Arrears)`
                  : `WhatsApp Notice for ${student?.parentName || 'Parent'} (${student?.fullName})`}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#047857' }}>
                Recipient Phone: <strong>{targetPhone}</strong> • WhatsApp Verified
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <span className="badge badge-green">Direct WhatsApp Integration</span>
          </div>
        </div>

        {/* Template Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setTemplateType('fee_reminder')}
            className={`btn ${templateType === 'fee_reminder' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <MessageCircle size={14} />
            <span>Fee Arrears Reminder</span>
          </button>

          <button
            type="button"
            onClick={() => setTemplateType('exam_schedule')}
            className={`btn ${templateType === 'exam_schedule' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <Calendar size={14} />
            <span>Trimester Exams Notice</span>
          </button>

          <button
            type="button"
            onClick={() => setTemplateType('pta_meeting')}
            className={`btn ${templateType === 'pta_meeting' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <Users size={14} />
            <span>PTA Meeting Circular</span>
          </button>

          <button
            type="button"
            onClick={() => setTemplateType('general')}
            className={`btn ${templateType === 'general' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <FileText size={14} />
            <span>Custom Announcement</span>
          </button>
        </div>

        {templateType === 'general' && (
          <div className="form-group">
            <label className="form-label">Custom Message Content</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Type your custom announcement to parents here..."
            />
          </div>
        )}

        {/* Message Preview Box */}
        <div className="card" style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B' }}>
              WhatsApp Message Preview (Pre-Formatted)
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              <Copy size={13} />
              <span>Copy Text</span>
            </button>
          </div>

          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.825rem',
              lineHeight: 1.5,
              color: '#0F172A',
              backgroundColor: '#FFFFFF',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #E2E8F0',
              maxHeight: '260px',
              overflowY: 'auto',
            }}
          >
            {messageText}
          </pre>
        </div>

        {/* Broadcast List (When in Broadcast Mode) */}
        {mode === 'broadcast' && (
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F2537', marginBottom: '0.6rem' }}>
              Individual Parent WhatsApp Direct Send List ({debtorsList.length} Debtors)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {debtorsList.map(({ student: s, arrears }) => {
                const pPhone = s.parentPhone;
                const pWa = formatPhoneForWhatsApp(pPhone);
                const pMsg = `🇬🇭 *${SCHOOL_INFO.name.toUpperCase()} — FEE NOTICE*\nDear ${s.parentName},\nKindly note that your ward *${s.fullName}* (${s.className}) has an outstanding fee balance of *${formatGHS(arrears)}* for ${activeTerm}.\nMoMo Merchant: 059 123 4567 (Ref: ${s.fullName.split(' ')[0]}). Thank you!`;
                const pUrl = `https://wa.me/${pWa}?text=${encodeURIComponent(pMsg)}`;

                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.8rem',
                    }}
                  >
                    <div>
                      <strong>{s.parentName}</strong> ({s.fullName} • {s.className})
                      <span style={{ color: '#B91C1C', fontWeight: 700, marginLeft: '0.5rem' }}>
                        Arrears: {formatGHS(arrears)}
                      </span>
                    </div>

                    <a
                      href={pUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm"
                      style={{ backgroundColor: '#10B981', color: '#FFF', fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                    >
                      <MessageCircle size={13} />
                      <span>Send WhatsApp</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close
          </button>

          {mode === 'single' && (
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="btn btn-lg"
              style={{ backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: 800 }}
            >
              <MessageCircle size={18} />
              <span>Launch WhatsApp Chat</span>
              <ExternalLink size={15} />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
