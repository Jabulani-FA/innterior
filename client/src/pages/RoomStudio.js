import React, { useEffect, useState } from 'react';
import {
  ArrowRightOutlined,
  CheckOutlined,
  CloudUploadOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '../components/cards/ProductCard';
import { createRoomDesign } from '../functions/roomDesign';

const roomTypes = ['Living room', 'Bedroom', 'Dining room', 'Home office'];
const designStyles = [
  { name: 'Warm minimal', detail: 'Natural textures, clean lines' },
  { name: 'Modern organic', detail: 'Sculptural forms, soft curves' },
  { name: 'Afro-modern', detail: 'Craft, pattern, rich materials' },
  { name: 'Quiet classic', detail: 'Timeless shapes, considered detail' },
];
const budgetPresets = [100000, 250000, 500000, 1000000];

const formatPrice = (value) => `₦${Number(value).toLocaleString()}`;

const prepareRoomImage = async (file) => {
  const image = await createImageBitmap(file);
  const maximumEdge = 1600;
  const ratio = Math.min(1, maximumEdge / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * ratio);
  canvas.height = Math.round(image.height * ratio);
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.86));
  if (!blob) throw new Error('This photo could not be prepared. Try another image.');
  return new File([blob], 'room-photo.jpg', { type: 'image/jpeg' });
};

const RoomStudio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [roomPhoto, setRoomPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [roomType, setRoomType] = useState('Living room');
  const [style, setStyle] = useState('Warm minimal');
  const [budget, setBudget] = useState(250000);
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!roomPhoto) {
      setPhotoPreview('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(roomPhoto);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [roomPhoto]);

  useEffect(() => {
    if (!generating) return undefined;
    const timer = window.setInterval(() => setStage((current) => (current + 1) % 3), 4500);
    return () => window.clearInterval(timer);
  }, [generating]);

  const choosePhoto = (event) => {
    const [file] = event.target.files || [];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Choose a JPG, PNG, or WebP photo.');
      event.target.value = '';
      return;
    }
    setRoomPhoto(file);
    setResult(null);
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (!roomPhoto) {
      toast.error('Add a photo of your room first.');
      return;
    }
    if (!Number.isFinite(Number(budget)) || Number(budget) < 5000) {
      toast.error('Set a budget of at least ₦5,000.');
      return;
    }

    setGenerating(true);
    setStage(0);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('roomImage', await prepareRoomImage(roomPhoto));
      formData.append('roomType', roomType);
      formData.append('style', style);
      formData.append('budget', String(budget));
      formData.append('notes', notes);
      const design = await createRoomDesign(formData);
      setResult(design);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'We could not create your room design.');
    } finally {
      setGenerating(false);
    }
  };

  const addDesignToBag = (goToBag = false) => {
    if (!result?.products?.length) return;

    const updatedCart = [...cart];
    result.products.forEach((product) => {
      const existingProduct = updatedCart.find((item) => item._id === product._id);
      if (existingProduct) {
        existingProduct.count = (existingProduct.count || 1) + 1;
      } else {
        updatedCart.push({ ...product, count: 1 });
      }
    });

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatch({ type: 'ADD_TO_CART', payload: updatedCart });
    toast.success(`${result.products.length} design pieces added to your bag.`);
    if (goToBag) navigate('/cart');
  };

  const resetStudio = () => {
    setResult(null);
    setRoomPhoto(null);
    setNotes('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="room-studio">
      <div className="studio-intro">
        <div>
          <p className="section-kicker">INNTERIOR ROOM STUDIO</p>
          <h1>See the room you <em>could come home to.</em></h1>
          <p className="studio-intro-copy">
            Share a room photo, set your spend, and explore a refreshed space shaped around real pieces from our collection.
          </p>
        </div>
        <div className="studio-intro-note">
          <span className="studio-step-number">01</span>
          <span>One photo in.<br />A considered room out.</span>
        </div>
      </div>

      {result ? (
        <section className="studio-result" aria-live="polite">
          <div className="studio-result-heading">
            <div>
              <p className="section-kicker">YOUR ROOM, REIMAGINED</p>
              <h2>{result.summary}</h2>
              <p className="studio-palette">{result.palette}</p>
            </div>
            <button className="studio-text-button" type="button" onClick={resetStudio}>
              <ReloadOutlined /> Start another room
            </button>
          </div>

          <div className="before-after-grid">
            <figure className="room-image-panel">
              <figcaption><span>01</span> YOUR ROOM</figcaption>
              <img src={photoPreview} alt="Your room before redesign" />
            </figure>
            <figure className="room-image-panel room-image-result">
              <figcaption><span>02</span> THE NEW DIRECTION</figcaption>
              <img src={result.image} alt="A reimagined version of your room" />
            </figure>
          </div>

          <div className="design-budget-bar">
            <div><span>YOUR BUDGET</span><strong>{formatPrice(result.budget)}</strong></div>
            <div><span>SELECTED PIECES</span><strong>{formatPrice(result.total)}</strong></div>
            <div><span>LEFT TO SPEND</span><strong>{formatPrice(result.remaining)}</strong></div>
            <button className="store-button store-button-dark" type="button" onClick={() => addDesignToBag(true)}>
              <ShoppingCartOutlined /> Add all & review bag <ArrowRightOutlined />
            </button>
          </div>

          <div className="studio-products-heading">
            <div>
              <p className="section-kicker">SELECTED FOR YOUR SPACE</p>
              <h2>Bring the look home</h2>
            </div>
            <span>{result.products.length} pieces · {formatPrice(result.total)}</span>
          </div>
          {result.products.length ? (
            <div className="studio-product-grid">
              {result.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="studio-empty-products">No catalogue pieces matched this brief. Try a different budget or room direction.</p>
          )}
          <p className="studio-disclaimer">The room image is an AI concept. Product availability and exact appearance may vary; selected pieces above link to their live listings.</p>
        </section>
      ) : (
        <form className="studio-workspace" onSubmit={handleGenerate}>
          <section className="studio-setup">
            <div className="studio-section-title">
              <span className="studio-step-number">01</span>
              <div><p className="section-kicker">START WITH YOUR SPACE</p><h2>Set the scene</h2></div>
            </div>

            <label className={`room-photo-drop${photoPreview ? ' has-photo' : ''}`}>
              {photoPreview ? (
                <>
                  <img src={photoPreview} alt="Selected room preview" />
                  <span className="photo-change"><ReloadOutlined /> Change photo</span>
                </>
              ) : (
                <span className="photo-prompt">
                  <CloudUploadOutlined />
                  <strong>Choose a room photo</strong>
                  <span>JPG, PNG, or WebP · up to 8 MB</span>
                  <span className="photo-choose-button">Browse files</span>
                </span>
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} />
            </label>

            <div className="studio-form-row">
              <label className="studio-field">
                <span>Room</span>
                <select value={roomType} onChange={(event) => setRoomType(event.target.value)}>
                  {roomTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </label>
              <label className="studio-field">
                <span>Budget <small>NGN</small></span>
                <input
                  type="number"
                  min="5000"
                  max="20000000"
                  step="5000"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  required
                />
              </label>
            </div>

            <div className="budget-presets" aria-label="Budget suggestions">
              {budgetPresets.map((amount) => (
                <button
                  key={amount}
                  className={Number(budget) === amount ? 'is-selected' : ''}
                  type="button"
                  onClick={() => setBudget(amount)}
                >
                  {amount >= 1000000 ? `₦${amount / 1000000}m` : `₦${amount / 1000}k`}
                </button>
              ))}
            </div>

            <div className="studio-field studio-style-field">
              <span>Design direction</span>
              <div className="style-options" role="radiogroup" aria-label="Design direction">
                {designStyles.map((option) => (
                  <button
                    key={option.name}
                    className={`style-option${style === option.name ? ' is-selected' : ''}`}
                    type="button"
                    role="radio"
                    aria-checked={style === option.name}
                    onClick={() => setStyle(option.name)}
                  >
                    <span className="style-radio-mark">{style === option.name && <CheckOutlined />}</span>
                    <span><strong>{option.name}</strong><small>{option.detail}</small></span>
                  </button>
                ))}
              </div>
            </div>

            <label className="studio-field studio-notes-field">
              <span>Anything to keep in mind <small>OPTIONAL</small></span>
              <textarea
                value={notes}
                maxLength={500}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Colours you love, pieces to keep, how the room is used..."
                rows={3}
              />
            </label>

            <button className="store-button store-button-dark studio-submit" type="submit" disabled={generating || !roomPhoto}>
              {generating ? 'Creating your room concept...' : 'Reimagine my room'}
              {generating ? <span className="studio-button-pulse" /> : <ArrowRightOutlined />}
            </button>
            <p className="studio-privacy">Your photo is used only to create this design and is not saved to your account.</p>
          </section>

          <aside className={`studio-preview${generating ? ' is-generating' : ''}`}>
            {photoPreview ? (
              <img className="studio-preview-image" src={photoPreview} alt="Preview of the room to redesign" />
            ) : (
              <img className="studio-preview-image studio-preview-empty" src="/minh-pham-OtXADkUh3-I-unsplash.jpg" alt="A calm interior design inspiration" />
            )}
            <div className="studio-preview-overlay" />
            <div className="studio-preview-copy">
              <p className="section-kicker">A BETTER FEELING, BY DESIGN</p>
              <h2>{generating ? ['Reading the light in your room', 'Finding pieces within your budget', 'Composing your new space'][stage] : 'A fresh perspective starts here.'}</h2>
              <p>{generating ? 'This usually takes a little while.' : 'Your original photo stays alongside the concept, so you can compare the direction.'}</p>
            </div>
            {!generating && <span className="studio-preview-index">ROOM STUDY · 001</span>}
          </aside>
        </form>
      )}

      {!result && cart.length > 0 && (
        <Link className="studio-bag-link" to="/cart">
          Your bag has {cart.length} {cart.length === 1 ? 'piece' : 'pieces'} <ArrowRightOutlined />
        </Link>
      )}
    </div>
  );
};

export default RoomStudio;
