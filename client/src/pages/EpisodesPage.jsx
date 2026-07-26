import EntityManager from '../EntityManager';

const fields = [
  { name: 'number', label: '회차 번호', type: 'number' },
  { name: 'title', label: '제목', type: 'text' },
  { name: 'content', label: '내용', type: 'textarea', rows: 14 },
  { name: 'published_date', label: '발행일', type: 'date' },
  { name: 'plot_notes', label: '복선/떡밥 메모', type: 'textarea' },
  { name: 'reader_feedback', label: '독자 반응 메모', type: 'textarea' },
];

export default function EpisodesPage() {
  return (
    <EntityManager
      resource="episodes"
      title="연재 기록"
      fields={fields}
      listLabel={(item) => `${item.number}화. ${item.title || '(제목 없음)'}`}
    />
  );
}
