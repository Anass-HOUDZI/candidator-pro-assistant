
import React from 'react';
import { Star } from 'lucide-react';
import { CandidatureActions } from '@/components/candidatures/CandidatureActions';

interface Candidature {
  id: string;
  entreprise: string;
  poste: string;
  statut: string | null;
  date_envoi: string | null;
  salaire: string | null;
  priorite: string | null;
}

interface CandidatureTableProps {
  candidatures: Candidature[];
  onUpdate: () => void;
}

const getStatutColor = (statut: string | null) => {
  switch (statut) {
    case 'En cours':
      return 'bg-blue-100 text-blue-800';
    case 'Entretien':
      return 'bg-purple-100 text-purple-800';
    case 'En attente':
      return 'bg-yellow-100 text-yellow-800';
    case 'Refusée':
      return 'bg-red-100 text-red-800';
    case 'Accepté':
      return 'bg-emerald-100 text-emerald-800';
    case 'Offre reçue':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const CandidatureTable: React.FC<CandidatureTableProps> = ({ candidatures, onUpdate }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-900">Entreprise</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Poste</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Priorité</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Date d'envoi</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Salaire</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidatures.map((candidature) => (
            <tr key={candidature.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-4">
                <div className="font-medium text-gray-900">{candidature.entreprise}</div>
              </td>
              <td className="py-4 px-4">
                <div className="text-gray-900">{candidature.poste}</div>
              </td>
              <td className="py-4 px-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(candidature.statut)}`}>
                  {candidature.statut || 'En cours'}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-1">
                  {candidature.priorite === 'Haute' && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  {candidature.priorite === 'Moyenne' && <Star className="h-4 w-4 text-gray-400" />}
                  {candidature.priorite === 'Faible' && <Star className="h-4 w-4 text-gray-300" />}
                  <span className="text-sm">{candidature.priorite || 'Moyenne'}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-600">
                {candidature.date_envoi ? new Date(candidature.date_envoi).toLocaleDateString('fr-FR') : '-'}
              </td>
              <td className="py-4 px-4 text-gray-900">{candidature.salaire || '-'}</td>
              <td className="py-4 px-4">
                <CandidatureActions candidature={candidature} onUpdate={onUpdate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
