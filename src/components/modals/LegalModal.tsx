import { Modal } from '../ui/Modal';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | 'accessibility' | null;
  onClose: () => void;
}

export const LegalModal = ({ isOpen, type, onClose }: LegalModalProps) => {
  if (!type) return null;

  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    accessibility: 'Accessibility Commitment',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titles[type]}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-stone-300 text-sm font-light leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
        {type === 'privacy' && (
          <>
            <p><strong>Effective Date:</strong> October 2026</p>
            <p>Ember & Olive ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This privacy policy informs you about how we handle your personal information when you visit our website or make a dining reservation.</p>
            <h4 className="text-amber-200 font-serif text-base pt-2">1. Information We Collect</h4>
            <p>When you reserve a table or subscribe to our journal, we collect your full name, phone number, email address, preferred reservation date and time, party size, and dietary preferences.</p>
            <h4 className="text-amber-200 font-serif text-base pt-2">2. How We Use Your Information</h4>
            <p>Your details are used strictly to process table reservations, confirm dining availability, communicate essential restaurant updates, and improve your dining experience.</p>
            <h4 className="text-amber-200 font-serif text-base pt-2">3. Data Security</h4>
            <p>We implement appropriate technical safeguards to ensure your personal data is protected against unauthorized access, alteration, or disclosure.</p>
          </>
        )}

        {type === 'terms' && (
          <>
            <p><strong>Effective Date:</strong> October 2026</p>
            <p>Welcome to Ember & Olive. By accessing or using our website and reservation system, you agree to comply with and be bound by the following terms.</p>
            <h4 className="text-amber-200 font-serif text-base pt-2">1. Table Reservations</h4>
            <p>Table reservations are held for up to 15 minutes past the requested time slot before being released to waiting guests. Please notify us if you anticipate arriving late.</p>
            <h4 className="text-amber-200 font-serif text-base pt-2">2. Cancellations</h4>
            <p>We kindly request at least 2 hours notice for cancellations or changes in party size for general dining, and 24 hours notice for Private Dining Enclave bookings.</p>
            <h4 className="text-amber-200 font-serif text-base pt-2">3. Intellectual Property</h4>
            <p>All brand marks, imagery, photography, menu descriptions, and website design assets belong exclusively to Ember & Olive.</p>
          </>
        )}

        {type === 'accessibility' && (
          <>
            <p><strong>WCAG 2.1 AA Compliance Statement:</strong></p>
            <p>Ember & Olive is dedicated to making our digital and physical spaces accessible to all guests, including those with visual, auditory, cognitive, and motor impairments.</p>
            <h4 className="text-amber-200 font-serif text-base pt-2">Digital Accessibility Features</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-300">
              <li>High-contrast typography adhering to WCAG 4.5:1 legibility ratios.</li>
              <li>Visible keyboard focus outlines across all interactive controls and modal dialogues.</li>
              <li>Screen reader descriptive ARIA labels, semantic landmark elements, and image alternative text.</li>
              <li>Support for <code className="text-amber-300 bg-stone-950 px-1 py-0.5 rounded">prefers-reduced-motion</code> across animations.</li>
            </ul>
            <h4 className="text-amber-200 font-serif text-base pt-2">Physical Accessibility</h4>
            <p>Our restaurant in Vijay Nagar, Indore features step-free ramp entrance access, elevator access to private dining suites, and dedicated wheelchair accessible restrooms.</p>
          </>
        )}
      </div>
    </Modal>
  );
};
