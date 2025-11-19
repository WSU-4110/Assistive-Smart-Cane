import { useState, useEffect } from 'react';
import { Phone, User, Save, X } from 'lucide-react';
import { useEmergencyContact } from '../state/EmergencyContactContext';

export function EmergencyContactSettings() {
  const { contact, setContact } = useEmergencyContact();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhoneNumber(contact.phoneNumber);
    }
  }, [contact]);

  const handleSave = () => {
    if (name.trim() && phoneNumber.trim()) {
      setContact({ name: name.trim(), phoneNumber: phoneNumber.trim() });
      setIsEditing(false);
    } else {
      alert('Please enter both name and phone number');
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to remove the emergency contact?')) {
      setContact(null);
      setName('');
      setPhoneNumber('');
      setIsEditing(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX or XXX-XXX-XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <div className="p-6 bg-card border-4 border-border rounded-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Emergency Contact</h2>
        {!isEditing && contact && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Edit
          </button>
        )}
      </div>

      {!contact && !isEditing ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-4">No emergency contact set</p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Add Emergency Contact
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium">
              <User className="w-4 h-4" />
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter contact name"
              className="w-full px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              disabled={!isEditing}
              placeholder="(XXX) XXX-XXXX"
              className="w-full px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  if (contact) {
                    setName(contact.name);
                    setPhoneNumber(contact.phoneNumber);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}

          {contact && !isEditing && (
            <div className="pt-2">
              <button
                onClick={handleClear}
                className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
              >
                Remove Emergency Contact
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

