import { Phone, Mail, MapPin, Clock, Check } from "lucide-react";
import { Card } from "../../ui/card";

const ContactSidebar = ({ currentStep, contactInfoRef }) => {
  return (
    <div ref={contactInfoRef} className="space-y-8">
      <Card className="p-6 xs:p-8">
        <h3 className="text-xl xs:text-2xl font-foundation-bold mb-4 xs:mb-6 text-white">
          CONTACTEZ-NOUS DIRECTEMENT
        </h3>
        {/* CTA d'appel rapide — accessible au pouce sur mobile */}
        <a
          href="tel:+33768113839"
          className="btn btn-primary btn--lg w-full touch-target font-foundation-black mb-6 text-center"
        >
          <Phone className="w-5 h-5" />
          Appeler maintenant
        </a>
        <div className="space-y-6">
          <div className="flex items-start">
            <Phone className="w-6 h-6 text-dk-yellow mt-1 mr-4 flex-shrink-0" />
            <div>
              <p className="text-white font-medium">Téléphone</p>
              <p className="text-dk-gray-300">
                Appelez-nous pour un devis rapide. Nous répondons
                généralement sous 24h.
              </p>
              <a
                href="tel:+33768113839"
                className="text-dk-yellow hover:text-yellow-300 transition-colors"
              >
                +33 7 68 11 38 39
              </a>
            </div>
          </div>

          <div className="flex items-start">
            <Mail className="w-6 h-6 text-dk-yellow mt-1 mr-4 flex-shrink-0" />
            <div>
              <p className="text-white font-medium">Email</p>
              <p className="text-dk-gray-300">
                Envoyez-nous vos plans et photos pour un devis précis.
                Réponse garantie sous 24h.
              </p>
              <a
                href="mailto:contact@dkbuilding.fr"
                className="text-dk-yellow hover:text-yellow-300 transition-colors"
              >
                contact@dkbuilding.fr
              </a>
            </div>
          </div>

          <div className="flex items-start">
            <MapPin className="w-6 h-6 text-dk-yellow mt-1 mr-4 flex-shrink-0" />
            <div>
              <p className="text-white font-medium">Adresse</p>
              <p className="text-dk-gray-300">59 Rue Pierre Cormary</p>
              <p className="text-dk-gray-300">81000 Albi, Tarn</p>
              <p className="text-dk-gray-300">Occitanie, France</p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="w-6 h-6 text-dk-yellow mt-1 mr-4 flex-shrink-0" />
            <div>
              <p className="text-white font-medium">Horaires</p>
              <p className="text-dk-gray-300">
                Lundi - Vendredi : 8h00 - 18h00
              </p>
              <p className="text-dk-gray-300">Samedi : 9h00 - 12h00</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Pourquoi choisir DK BUILDING */}
      {currentStep !== 3 && (
        <Card className="bg-gradient-to-br from-dk-yellow/10 to-yellow-300/10 border-dk-yellow/20 p-8">
          <div className="flex md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-foundation-bold mb-4 text-white">
                POURQUOI CHOISIR{" "}
                <span className="font-foundation-black hover:text-dk-yellow">
                  DK BUILDING
                </span>{" "}
                ?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-dk-yellow mt-1 mr-3 flex-shrink-0" />
                  <span className="text-dk-gray-300">
                    Devis gratuit et sans engagement. Vous n'avez aucune
                    obligation.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-dk-yellow mt-1 mr-3 flex-shrink-0" />
                  <span className="text-dk-gray-300">
                    Expertise technique certifiée. Des années d'expérience
                    à votre service.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-dk-yellow mt-1 mr-3 flex-shrink-0" />
                  <span className="text-dk-gray-300">
                    Matériaux de qualité premium. Des résultats durables
                    et fiables.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-dk-yellow mt-1 mr-3 flex-shrink-0" />
                  <span className="text-dk-gray-300">
                    Garantie sur tous nos travaux. Votre tranquillité est
                    notre priorité.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-dk-yellow mt-1 mr-3 flex-shrink-0" />
                  <span className="text-dk-gray-300">
                    Intervention dans toute la France. Où que vous soyez,
                    nous intervenons.
                  </span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-dk-yellow/5 rounded-lg border border-dk-yellow/20">
                <p className="text-sm text-dk-gray-300">
                  <strong className="text-dk-yellow">
                    Réponse sous 24h.
                  </strong>{" "}
                  Devis gratuit et sans engagement.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContactSidebar;
