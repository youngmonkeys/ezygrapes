import C from './consts';
import styles from './styles';

export default (editor) => {
  const bm = editor.BlockManager;
  editor.addStyle(styles);

  bm.add(C.ref, {
    label: editor.I18n.t(C.label),
    category: editor.I18n.t(C.category),
    attributes: { class: 'fa fa-th' },
    content: `
      <a class="portcards" href="#" target="_self" data-gjs-type="portcards">
       <div class="media-thumb-wrapper">
        <img class="media-thumb" src="https://placehold.co/400x200" alt="Ảnh đại diện" data-gjs-type="image" />
        <div class="media-play-icon" style="display: none;">
          <i class="fa fa-play"></i>
        </div>
        </div>
        <h3 class="media-title">Tiêu đề bài viết</h3>
        <p class="media-desc">Mô tả ngắn gọn...</p>
        <div class="meta">
          <span class="meta-category">
            <i class="fa fa-folder"></i>
            Chuyên mục
          </span> Sáng tác • <span class="meta-author">Tác giả</span>
        </div>
      </a>
    `,
  });
};
