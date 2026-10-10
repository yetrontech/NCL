const PHONE = "(404) 731-2371";
const EMAIL = "support@newcreationliving.org";

export default function OfferCorners() {
  return (
    <>
      <a className="offer-corner offer-corner-phone" href="tel:+14047312371">
        {PHONE}
      </a>
      <a className="offer-corner offer-corner-email" href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>
    </>
  );
}
