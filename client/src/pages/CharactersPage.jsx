import EntityManager from '../EntityManager';

const fields = [
  { name: 'name', label: '이름', type: 'text' },
  { name: 'aliases', label: '별칭', type: 'text' },
  { name: 'age', label: '나이', type: 'text' },
  {
    name: 'status',
    label: '상태',
    type: 'select',
    options: ['생존', '사망', '실종', '등장중단'],
    default: '생존',
  },
  { name: 'faction_id', label: '소속 세력', type: 'relation', resource: 'factions', labelField: 'name' },
  { name: 'position', label: '직업(직급/계급)', type: 'textarea', rows: 2 },
  { name: 'specialty', label: '특기', type: 'textarea', rows: 2 },
  { name: 'characteristic', label: '캐릭터 특징', type: 'textarea' },
  { name: 'personality', label: '성격', type: 'textarea' },
  {
    name: 'skills',
    label: '보유 스킬',
    type: 'repeater',
    itemLabel: '스킬',
    itemFields: [
      { name: 'name', label: '스킬명', type: 'text' },
      { name: 'incantation', label: '스킬 영창', type: 'textarea' },
      { name: 'trait', label: '특징', type: 'textarea' },
      { name: 'constraint', label: '제약사항', type: 'textarea' },
    ],
  },
];

export default function CharactersPage() {
  return (
    <EntityManager
      resource="characters"
      title="캐릭터"
      fields={fields}
      listLabel={(item) => item.name || '(이름 없음)'}
    />
  );
}
