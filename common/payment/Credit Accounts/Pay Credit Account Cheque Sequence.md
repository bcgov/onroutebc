# Sequence to make a payment against a credit account via cheque

```mermaid
sequenceDiagram
    participant cvc as CV Client
    participant PPC
    participant onRouteBC
    participant CFS
    cvc->>PPC: Provice cheque to PPC
    note over cvc,PPC: Can send via physical mail<br/>or in person at permit centre
    PPC->>onRouteBC: Find client by client<br/>number
    onRouteBC-->>PPC: Show client page
    PPC->>onRouteBC: Record payment
    note over PPC,onRouteBC: TBD what interface will look<br/>like, but will include a form<br/>to supply amount and payment<br/>method.
    alt CFS is unavailable
        onRouteBC->>onRouteBC: Save payment details<br/>including cheque number<br/>and amount to DB<br/>for later processing
    else CFS is available
        onRouteBC->>CFS: Create receipt
        note over onRouteBC,CFS: TBD whether the receipt will<br/>need to be explicitly applied to<br/>outstanding invoices or if it can<br/>just be left on file.
        CFS-->>onRouteBC: Return receipt number
        onRouteBC->>onRouteBC: Record receipt number in DB
        onRouteBC-->>PPC: Return success message
    end
```