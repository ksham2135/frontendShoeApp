import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.name || formData.name.length < 2) {
      alert('Name is required');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      alert('Valid email is required');
      return;
    }
    if (!formData.subject || formData.subject.length < 3) {
      alert('Subject is required');
      return;
    }
    if (!formData.message || formData.message.length < 10) {
      alert('Message must be at least 10 characters');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground mb-8">Have a question? We'd love to hear from you.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  type="text"
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  required 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input 
                type="text"
                value={formData.subject} 
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })} 
                className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea 
                rows={5} 
                value={formData.message} 
                onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none resize-none"
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
