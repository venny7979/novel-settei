import EntityManager from '../EntityManager';

const fields = [
  { name: 'name', label: '세력 이름', type: 'text' },
  { name: 'leader', label: '수장', type: 'text' },
  { name: 'territory', label: '영역/근거지', type: 'text' },
  { name: 'goal', label: '목표/이념', type: 'textarea' },
  { name: 'description', label: '설명', type: 'textarea', rows: 8 },
];

export default function FactionsPage() {
  return (
    <EntityManager
      resource="factions"
      title="세력"
      fields={fields}
      listLabel={(item) => item.name || '(이름 없음)'}
    />
  );
}
