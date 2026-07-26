import { useEffect, useState } from 'react';
import { listItems, createItem, updateItem, deleteItem } from './storage';

function emptyForm(fields) {
  const form = {};
  fields.forEach((f) => {
    if (f.type === 'repeater') {
      form[f.name] = [];
    } else {
      form[f.name] = f.default ?? '';
    }
  });
  return form;
}

function emptyRepeaterRow(itemFields) {
  const row = {};
  itemFields.forEach((sf) => {
    row[sf.name] = '';
  });
  return row;
}

function RepeaterField({ field, rows, onChange }) {
  function updateRow(index, name, value) {
    const next = rows.map((row, i) => (i === index ? { ...row, [name]: value } : row));
    onChange(next);
  }

  function addRow() {
    onChange([...rows, emptyRepeaterRow(field.itemFields)]);
  }

  function removeRow(index) {
    onChange(rows.filter((_, i) => i !== index));
  }

  return (
    <div className="repeater">
      {rows.map((row, index) => (
        <div className="repeater-row" key={index}>
          <div className="repeater-row-header">
            <span>#{index + 1}</span>
            <button type="button" className="danger" onClick={() => removeRow(index)}>
              제거
            </button>
          </div>
          {field.itemFields.map((sf) => (
            <div className="field" key={sf.name}>
              <label>{sf.label}</label>
              {sf.type === 'textarea' ? (
                <textarea
                  rows={sf.rows ?? 2}
                  value={row[sf.name]}
                  onChange={(e) => updateRow(index, sf.name, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  value={row[sf.name]}
                  onChange={(e) => updateRow(index, sf.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button type="button" onClick={addRow}>
        + {field.itemLabel ?? '항목'} 추가
      </button>
    </div>
  );
}

export default function EntityManager({ resource, title, fields, listLabel }) {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm(fields));
  const [relationOptions, setRelationOptions] = useState({});

  async function refresh() {
    const data = await listItems(resource);
    setItems(data);
  }

  useEffect(() => {
    refresh();
    fields
      .filter((f) => f.type === 'relation')
      .forEach(async (f) => {
        const data = await listItems(f.resource);
        setRelationOptions((prev) => ({ ...prev, [f.name]: data }));
      });
  }, [resource]);

  function selectItem(item) {
    setSelectedId(item.id);
    const nextForm = emptyForm(fields);
    fields.forEach((f) => {
      if (f.type === 'repeater') {
        try {
          nextForm[f.name] = item[f.name] ? JSON.parse(item[f.name]) : [];
        } catch {
          nextForm[f.name] = [];
        }
      } else {
        nextForm[f.name] = item[f.name] ?? '';
      }
    });
    setForm(nextForm);
  }

  function startNew() {
    setSelectedId(null);
    setForm(emptyForm(fields));
  }

  function handleChange(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form };
    fields
      .filter((f) => f.type === 'repeater')
      .forEach((f) => {
        payload[f.name] = JSON.stringify(form[f.name] ?? []);
      });
    if (selectedId) {
      await updateItem(resource, selectedId, payload);
    } else {
      const created = await createItem(resource, payload);
      setSelectedId(created.id);
    }
    await refresh();
  }

  async function handleDelete() {
    if (!selectedId) return;
    if (!confirm('정말 삭제할까요?')) return;
    await deleteItem(resource, selectedId);
    startNew();
    await refresh();
  }

  return (
    <div className="entity-manager">
      <div className="entity-list">
        <div className="entity-list-header">
          <h2>{title}</h2>
          <button onClick={startNew}>+ 새로 만들기</button>
        </div>
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className={item.id === selectedId ? 'active' : ''}
              onClick={() => selectItem(item)}
            >
              {listLabel(item)}
            </li>
          ))}
          {items.length === 0 && <li className="empty">아직 항목이 없습니다.</li>}
        </ul>
      </div>

      <form className="entity-form" onSubmit={handleSubmit}>
        {fields.map((f) => (
          <div className="field" key={f.name}>
            <label>{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                rows={f.rows ?? 4}
                value={form[f.name]}
                onChange={(e) => handleChange(f.name, e.target.value)}
              />
            ) : f.type === 'select' ? (
              <select
                value={form[f.name]}
                onChange={(e) => handleChange(f.name, e.target.value)}
              >
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : f.type === 'relation' ? (
              <select
                value={form[f.name] ?? ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
              >
                <option value="">(없음)</option>
                {(relationOptions[f.name] ?? []).map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt[f.labelField]}
                  </option>
                ))}
              </select>
            ) : f.type === 'repeater' ? (
              <RepeaterField
                field={f}
                rows={form[f.name] ?? []}
                onChange={(rows) => handleChange(f.name, rows)}
              />
            ) : (
              <input
                type={f.type ?? 'text'}
                value={form[f.name]}
                onChange={(e) => handleChange(f.name, e.target.value)}
              />
            )}
          </div>
        ))}
        <div className="form-actions">
          <button type="submit">{selectedId ? '수정 저장' : '생성'}</button>
          {selectedId && (
            <button type="button" className="danger" onClick={handleDelete}>
              삭제
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
