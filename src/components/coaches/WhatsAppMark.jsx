import WhatsAppLogo from '../../assets/whatsapp-official.svg';
// Original, unmodified logo from WhatsApp's Help Center assets:
// https://static.whatsapp.net/rsrc.php/yd/r/RIwqg3B0HgO.svg
export default function WhatsAppMark() {
 return <span className="landing-whatsapp-mark" aria-hidden="true"><img src={WhatsAppLogo} alt=""/></span>;
}
