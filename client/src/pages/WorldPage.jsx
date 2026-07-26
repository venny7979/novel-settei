import EntityManager from '../EntityManager';

const fields = [
  {
    name: 'category',
    label: '분류',
    type: 'select',
    options: ['지역', '역사', '마법/기술체계', '용어', '아이템', '기타'],
    default: '지역',
  },
  { name: 'title', label: '제목', type: 'text' },
  { name: 'tags', label: '태그 (쉼표로 구분)', type: 'text' },
  { name: 'content', label: '내용', type: 'textarea', rows: 10 },
];

export default function WorldPage() {
  return (
    <EntityManager
      resource="world-entries"
      title="세계관"
      fields={fields}
      listLabel={(item) => `[${item.category}] ${item.title || '(제목 없음)'}`}
    />
  );
}
