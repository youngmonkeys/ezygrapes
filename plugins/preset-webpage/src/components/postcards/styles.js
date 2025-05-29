export default `
.portcards {
  display: block;
  text-decoration: none;
  border-radius: 12px;
  border: 1px solid #eee;
  background: #fff;
  padding: 8px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.portcards:hover {
  z-index: 1;
}

.media-thumb-wrapper::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 80%);
  opacity: 0;
  transition: all 0.6s ease;
  border-radius: 50%;
  z-index: 1;
}

.portcards:hover .media-thumb-wrapper::before {
  width: 125%;
  height: 125%;
  opacity: 1;
}

.media-thumb-wrapper {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  z-index: 2;
}

.portcards:hover .media-thumb-wrapper img {
  transform: scale(1.05);
}

.media-thumb {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  z-index: 2;
}

.media-play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 10px;
  border-radius: 999px;
  font-size: 20px;
  z-index: 3;
  display: none;
  width: 50px;
  height: 50px;
  text-align: center;
}

.media-play-icon i {
  font-size: 24px;
}

.media-title {
  font-size: 30px;
  font-weight: 300;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  color: #000;
}

.media-desc {
  font-size: 16px;
  color: #525252;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.meta {
  font-size: 18px;
  font-weight: 500;
  color: #525252
}

.meta-category {
  font-weight: bold;
  color: rgb(137 23 238 / 1);
  margin-right: 5px;
}
`;