import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';

import './styles.css';

import Dropzone from '../../components/Dropzone';

import * as api from '../../services/api';
import logo from '../../assets/logo.svg';
import { Item } from '../../types/db';

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('');

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  const [selectedFile, setSelectedFile] = useState<File>();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });

  const history = useHistory();

  useEffect(() => {
    api.db.items.index().then(res => setItems(res.data));
    api.ibge.states().then(res => setUfs(res.data.map(uf => uf.sigla).sort()));

    navigator.geolocation.getCurrentPosition(position => {
      setInitialPosition([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') return;

    api.ibge.cities(selectedUf).then(res => setCities(res.data.map(c => c.nome)));
  }, [selectedUf]);

  function toggleItem(itemId: number) {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: FormEvent) {
    try {
      event.preventDefault();

      if (!selectedFile) return;

      const point = {
        ...formData,
        uf: selectedUf,
        city: selectedCity,
        latitude: selectedPosition[0],
        longitude: selectedPosition[1]
      };
      const items = selectedItems;

      const res = await api.db.points.store({ point, items });
      await api.db.points.image(res.data.id, selectedFile);

      alert('Ponto de coleta criado!');
      history.push('/');
    } catch (err) {
      console.log(err.response.data);
      alert('Erro ao criar ponto.');
    };
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereços</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map
            center={initialPosition}
            zoom={15}
            onclick={e => setSelectedPosition([e.latlng.lat, e.latlng.lng])}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={e => setSelectedUf(e.target.value)}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf, i) => (
                  <option key={i} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map((city, i) => (
                  <option key={i} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereços</h2>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li
                key={item.id}
                className={selectedItems.includes(item.id) ? "selected" : ""}
                onClick={() => toggleItem(item.id)}
              >
                <img src={item.url_image} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  );
}

export default CreatePoint;