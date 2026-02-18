const CurrentLocation = () => {
  return (
    <div className="h-[80vh] w-full md:w-[70%]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14220.799042400286!2d-54.4884798!3d-26.99223!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f9beffb27ddd0b%3A0xf7812bd0bda47c00!2sAvenida%20Libertado%20%26%20Facundo%20Quiroga%2C%20N3364%20San%20Vicente%2C%20Misiones!5e0!3m2!1ses-419!2sar!4v1758253574435!5m2!1ses-419!2sar"
        style={{ border: 0, width: '100%', height: '100%' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};
export default CurrentLocation