# Security Policy & PCI Compliance Guidelines

RevenueShield follows strict security standards:
- **No Sensitive Payment Data**: Never stores card numbers, CVVs, or bank login credentials.
- **Backend-Only Secrets**: API keys are isolated in backend environment variables.
- **Deterministic Policy Safety**: Financial actions cannot be executed directly by unstructured LLM outputs.
- **Auditable Log Trail**: All AI recommendations and execution decisions are recorded.
