import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3001';

const AnnoncesManager = () => {
  const [annonces, setAnnonces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAnnonce, setEditingAnnonce] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    contenu: '',
    categorie: 'actualite',
    statut: 'brouillon'
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_BASE_URL}/api/annonces`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la récupération');
      const result = await response.json();
      setAnnonces(result.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des annonces');
      setIsLoading(false);
    }
  };

  const onDropImages = async (acceptedFiles) => {
    const token = localStorage.getItem('jwt_token');
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploadType', 'annonce');

        const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) throw new Error('Erreur lors de l\'upload');
        const result = await response.json();
        setUploadedImages([...uploadedImages, result.data.filename]);
        toast.success(`${file.name} uploadé`);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error(`Erreur lors de l'upload de ${file.name}`);
      }
    }
  };

  const onDropDocuments = async (acceptedFiles) => {
    const token = localStorage.getItem('jwt_token');
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploadType', 'annonce');

        const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) throw new Error('Erreur lors de l\'upload');
        const result = await response.json();
        setUploadedDocuments([...uploadedDocuments, result.data.filename]);
        toast.success(`${file.name} uploadé`);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error(`Erreur lors de l'upload de ${file.name}`);
      }
    }
  };

  const { getRootProps: getRootPropsImages, isDragActive: isDragActiveImages } = useDropzone({
    onDrop: onDropImages,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 8 * 1024 * 1024
  });

  const { getRootProps: getRootPropsDocuments, isDragActive: isDragActiveDocuments } = useDropzone({
    onDrop: onDropDocuments,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 8 * 1024 * 1024
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwt_token');
      const url = editingAnnonce
        ? `${API_BASE_URL}/api/annonces/${editingAnnonce.id}`
        : `${API_BASE_URL}/api/annonces`;
      
      const method = editingAnnonce ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          images: uploadedImages,
          documents: uploadedDocuments
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
      
      toast.success(editingAnnonce ? 'Annonce mise à jour' : 'Annonce créée');
      setShowModal(false);
      setEditingAnnonce(null);
      setFormData({ titre: '', description: '', contenu: '', categorie: 'actualite', statut: 'brouillon' });
      setUploadedImages([]);
      setUploadedDocuments([]);
      fetchAnnonces();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_BASE_URL}/api/annonces/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      toast.success('Annonce supprimée');
      fetchAnnonces();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (annonce) => {
    setEditingAnnonce(annonce);
    setFormData({
      titre: annonce.titre || '',
      description: annonce.description || '',
      contenu: annonce.contenu || '',
      categorie: annonce.categorie || 'actualite',
      statut: annonce.statut || 'brouillon'
    });
    setUploadedImages(annonce.images || []);
    setUploadedDocuments(annonce.documents || []);
    setShowModal(true);
  };

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const removeDocument = (index) => {
    setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index));
  };

  const filteredAnnonces = annonces.filter(annonce =>
    annonce.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    annonce.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestion des Annonces</h1>
          <p className="text-gray-400">Créez et gérez vos annonces</p>
        </div>
        <button
          onClick={() => {
            setEditingAnnonce(null);
            setFormData({ titre: '', description: '', contenu: '', categorie: 'actualite', statut: 'brouillon' });
            setShowModal(true);
          }}
          className="bg-[#F3E719] text-[#0E0E0E] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#e6d416] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle annonce
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F3E719]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-white">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAnnonces.map((annonce) => (
            <div
              key={annonce.id}
              className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{annonce.titre}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      annonce.statut === 'publie' ? 'bg-green-500/20 text-green-400' :
                      annonce.statut === 'brouillon' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {annonce.statut}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                      {annonce.categorie}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">{annonce.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Vues: {annonce.vue_count || 0}</span>
                    <span>Créée: {new Date(annonce.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(annonce)}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(annonce.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingAnnonce ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Titre *</label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#F3E719]"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#F3E719]"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-white">Contenu (Markdown)</label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm text-[#F3E719] hover:underline"
                  >
                    {showPreview ? 'Éditer' : 'Prévisualiser'}
                  </button>
                </div>
                {showPreview ? (
                  <div className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-800 rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto">
                    <ReactMarkdown className="prose prose-invert max-w-none text-white">
                      {formData.contenu || '*Aucun contenu*'}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    value={formData.contenu}
                    onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                    rows="8"
                    placeholder="Utilisez Markdown pour formater votre contenu..."
                    className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F3E719] font-mono text-sm"
                  />
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Support Markdown : **gras**, *italique*, [liens](url), etc.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Images</label>
                  <div
                    {...getRootPropsImages()}
                    className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
                      isDragActiveImages
                        ? 'border-[#F3E719] bg-[#F3E719]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input {...getRootPropsImages().inputProps} />
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        {isDragActiveImages ? 'Déposez les images...' : 'Glissez-déposez ou cliquez'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (max 8 MB)</p>
                    </div>
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="flex items-center justify-between bg-[#0E0E0E] p-2 rounded">
                          <span className="text-sm text-gray-300 truncate flex-1">{img}</span>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="ml-2 p-1 text-red-400 hover:bg-red-500/20 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-white mb-2">Documents</label>
                  <div
                    {...getRootPropsDocuments()}
                    className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
                      isDragActiveDocuments
                        ? 'border-[#F3E719] bg-[#F3E719]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input {...getRootPropsDocuments().inputProps} />
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        {isDragActiveDocuments ? 'Déposez les documents...' : 'Glissez-déposez ou cliquez'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (max 8 MB)</p>
                    </div>
                  </div>
                  {uploadedDocuments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between bg-[#0E0E0E] p-2 rounded">
                          <span className="text-sm text-gray-300 truncate flex-1">{doc}</span>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="ml-2 p-1 text-red-400 hover:bg-red-500/20 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Catégorie</label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#F3E719]"
                  >
                    <option value="actualite">Actualité</option>
                    <option value="offre">Offre</option>
                    <option value="evenement">Événement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2">Statut</label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#F3E719]"
                  >
                    <option value="brouillon">Brouillon</option>
                    <option value="publie">Publié</option>
                    <option value="archive">Archivé</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAnnonce(null);
                  }}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#F3E719] text-[#0E0E0E] rounded-lg font-semibold hover:bg-[#e6d416] transition-colors"
                >
                  {editingAnnonce ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnoncesManager;

