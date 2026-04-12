import { useEffect, useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import {
  getAuthToken,
  getCurrentUserId,
  mediaApi,
  propertyApi,
  propertyListingApi,
} from '../services';

function toNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function CreateProperty() {
  const [propertyTypes, setPropertyTypes] = useState(['APARTMENT', 'VILLA']);
  const [propertyConditions, setPropertyConditions] = useState([
    'NEW',
    'EXCELLENT',
    'GOOD',
    'NEEDS_RENOVATION',
  ]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'APARTMENT',
    condition: 'NEW',
    yearBuilt: '',
    price: '',
    lotAreaSqFt: '',
    propertyAreaSqFt: '',
    seekingBroker: false,
    bedrooms: '',
    bathrooms: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadOptions() {
      try {
        const [types, conditions] = await Promise.all([
          propertyApi.getAllPropertyTypes(),
          propertyApi.getAllPropertyConditions(),
        ]);

        if (!isMounted) {
          return;
        }

        if (Array.isArray(types) && types.length > 0) {
          setPropertyTypes(types);
          setFormData((current) => ({ ...current, type: types[0] }));
        }

        if (Array.isArray(conditions) && conditions.length > 0) {
          setPropertyConditions(conditions);
          setFormData((current) => ({ ...current, condition: conditions[0] }));
        }
      } catch {
        // Keep defaults if options cannot be fetched.
      }
    }

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const uploadImages = async (token) => {
    const uploadedGallery = [];
    for (const file of galleryFiles) {
      const uploaded = await mediaApi.uploadFile(file, token);
      if (uploaded?.url) {
        uploadedGallery.push(uploaded.url);
      }
    }

    let uploadedBannerUrl = null;
    if (bannerFile) {
      const bannerResult = await mediaApi.uploadFile(bannerFile, token);
      uploadedBannerUrl = bannerResult?.url || null;
    }

    return {
      uploadedBannerUrl,
      uploadedGallery,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const token = getAuthToken();
    const sellerId = getCurrentUserId();

    if (!token || !sellerId) {
      setErrorMessage('Sign in first so we can submit the listing with your account.');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMessage('Title and description are required.');
      return;
    }

    if (!bannerFile && galleryFiles.length === 0) {
      setErrorMessage('Upload at least one image.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { uploadedBannerUrl, uploadedGallery } = await uploadImages(token);
      const fallbackBanner = uploadedGallery[0] || null;
      const finalBanner = uploadedBannerUrl || fallbackBanner;

      if (!finalBanner) {
        throw new Error('Unable to resolve a banner image.');
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: toNumber(formData.price),
        sellerId,
        bannerImage: { imageUrl: finalBanner },
        propertyImages: uploadedGallery.map((url) => ({ imageUrl: url })),
        property: {
          propertyAreaSqFt: toNumber(formData.propertyAreaSqFt),
          lotAreaSqFt: toNumber(formData.lotAreaSqFt),
          bedrooms: toNumber(formData.bedrooms),
          bathrooms: toNumber(formData.bathrooms),
          type: formData.type,
          location: {
            street: formData.street.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            zipCode: formData.zipCode.trim(),
          },
          yearBuilt: toNumber(formData.yearBuilt),
          condition: formData.condition,
          amenities: [],
        },
        managementStatus: formData.seekingBroker
          ? 'BROKER_REQUESTED'
          : 'SELLER_AUTHORIZED',
      };

      const created = await propertyListingApi.submitPropertyListing(payload, token);
      setSuccessMessage(
        `Listing submitted successfully${created?.propertyListingId ? ` (ID: ${created.propertyListingId})` : ''
        }.`,
      );
    } catch (error) {
      setErrorMessage(error.message || 'Failed to submit listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
      <TopNavBar />

      <main className="pt-32 pb-24 max-w-5xl mx-auto px-6 flex-grow w-full">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4 font-headline">
            List Your Property
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Submit your listing directly to the backend review workflow.
          </p>
        </header>

        {errorMessage && (
          <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="mb-6 rounded-lg bg-primary-container px-4 py-3 text-sm text-on-primary-container">
            {successMessage}
          </p>
        )}

        <form className="space-y-12" onSubmit={handleSubmit}>
          <section className="bg-surface-container-low p-8 md:p-10 rounded-xl space-y-8">
            <div className="flex items-center space-x-3 mb-2">
              <span className="material-symbols-outlined text-primary">description</span>
              <h2 className="text-2xl font-bold text-on-surface font-headline">Basic Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Property Title</label>
                <input
                  className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none"
                  placeholder="Modernist Cantilever Residence in Silver Lake"
                  type="text"
                  value={formData.title}
                  onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Description</label>
                <textarea
                  className="w-full bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all p-4 outline-none"
                  placeholder="Describe the soul of the home..."
                  rows={5}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, description: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Property Type</label>
                <select
                  className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none appearance-none"
                  value={formData.type}
                  onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))}
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Condition</label>
                <select
                  className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none appearance-none"
                  value={formData.condition}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, condition: event.target.value }))
                  }
                >
                  {propertyConditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low p-8 md:p-10 rounded-xl space-y-8">
            <div className="flex items-center space-x-3 mb-2">
              <span className="material-symbols-outlined text-primary">square_foot</span>
              <h2 className="text-2xl font-bold text-on-surface font-headline">Specifications & Price</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Year Built</label>
                <input
                  className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none"
                  placeholder="2024"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, yearBuilt: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Asking Price</label>
                <input
                  className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all pl-4 pr-4 outline-none"
                  placeholder="2500000"
                  type="number"
                  value={formData.price}
                  onChange={(event) => setFormData((current) => ({ ...current, price: event.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Lot Area (sq ft)</label>
                <input
                  className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none"
                  placeholder="8500"
                  type="number"
                  value={formData.lotAreaSqFt}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, lotAreaSqFt: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Property Area (sq ft)</label>
                <input
                  className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none"
                  placeholder="3200"
                  type="number"
                  value={formData.propertyAreaSqFt}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, propertyAreaSqFt: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Seeking Broker</label>
                <div className="flex items-center space-x-6 h-12">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      className="w-5 h-5 text-primary border-none bg-surface-container-high focus:ring-primary/20"
                      name="broker"
                      type="radio"
                      checked={formData.seekingBroker}
                      onChange={() => setFormData((current) => ({ ...current, seekingBroker: true }))}
                    />
                    <span className="text-on-surface-variant">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      className="w-5 h-5 text-primary border-none bg-surface-container-high focus:ring-primary/20"
                      name="broker"
                      type="radio"
                      checked={!formData.seekingBroker}
                      onChange={() => setFormData((current) => ({ ...current, seekingBroker: false }))}
                    />
                    <span className="text-on-surface-variant">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Bedrooms</label>
                <input
                  className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none"
                  placeholder="4"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, bedrooms: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Bathrooms</label>
                <input
                  className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none"
                  placeholder="3"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, bathrooms: event.target.value }))
                  }
                />
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low p-8 md:p-10 rounded-xl space-y-8">
            <div className="flex items-center space-x-3 mb-2">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <h2 className="text-2xl font-bold text-on-surface font-headline">Location</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Street Address</label>
                  <input
                    className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none"
                    placeholder="123 Vista Horizon Dr"
                    type="text"
                    value={formData.street}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, street: event.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">City</label>
                    <input
                      className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none"
                      placeholder="Malibu"
                      type="text"
                      value={formData.city}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, city: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">State</label>
                    <input
                      className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none"
                      placeholder="CA"
                      type="text"
                      value={formData.state}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, state: event.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Zip Code</label>
                  <input
                    className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none"
                    placeholder="90265"
                    type="text"
                    value={formData.zipCode}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, zipCode: event.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low p-8 md:p-10 rounded-xl space-y-8">
            <div className="flex items-center space-x-3 mb-2">
              <span className="material-symbols-outlined text-primary">photo_camera</span>
              <h2 className="text-2xl font-bold text-on-surface font-headline">Visual Narrative</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Banner Image</label>
                <input
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high px-4 py-3"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setBannerFile(event.target.files?.[0] || null)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Gallery Images</label>
                <input
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high px-4 py-3"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setGalleryFiles(Array.from(event.target.files || []))}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row items-center justify-end space-y-4 md:space-y-0 md:space-x-6 pt-12 border-t border-outline-variant/10">
            <button className="w-full md:w-auto bg-primary text-on-primary font-bold px-12 py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Listing...' : 'Submit Listing'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

