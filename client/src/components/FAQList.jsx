export function FAQList({ faqs, onDeleteFaq, loading }) {
  if (faqs.length === 0) {
    return (
      <div className="empty-state">
        <p>No rules added yet. Add one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="faq-list">
      {faqs.map((faq) => (
        <div key={faq.id} className="faq-item">
          <div className="faq-content">
            <p className="faq-question">{faq.question}</p>
            <div className="faq-meta">
              <span className="tag category">{faq.category}</span>
              <span className="tag action">{faq.action}</span>
              <span className="tag limit">Limit: ₹{faq.limit}</span>
            </div>
          </div>
          <button
            className="btn btn-small btn-danger"
            onClick={() => onDeleteFaq(faq.id)}
            disabled={loading}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
