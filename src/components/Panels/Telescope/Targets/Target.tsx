import { useRef } from 'react';
import { TargetType } from '@/types';
import { useLongPress } from '@/Helpers/longPress';
import { useSetTargetEdit } from '@/components/atoms/target';
import { useCanEdit } from '@/components/atoms/auth';

export function Target({
  target,
  updateSelectedTarget,
  selectedTarget = undefined,
  targetIndex = undefined,
}: {
  target: TargetType;
  updateSelectedTarget(this: void, target: number): void | Promise<void>;
  selectedTarget?: number | null;
  targetIndex?: number | undefined;
}) {
  const canEdit = useCanEdit();
  const setTargetEdit = useSetTargetEdit();
  const clickRef = useRef<ReturnType<typeof setTimeout>>();

  function onLongPress() {
    clearTimeout(clickRef.current);
    setTargetEdit({
      isVisible: true,
      target: target,
      targetIndex: targetIndex,
    });
  }

  const longPressEvent = useLongPress(onLongPress, targetClicked, {
    shouldPreventDefault: true,
    delay: 250,
  });

  function targetClicked(e: React.MouseEvent | React.TouchEvent) {
    if (!canEdit) return;
    switch (e.detail) {
      case 1:
        clickRef.current = setTimeout(() => {
          void updateSelectedTarget(target.pk);
        }, 300);
        break;
      case 2:
        clearTimeout(clickRef.current);
        setTargetEdit({
          isVisible: true,
          target: target,
          targetIndex: targetIndex,
        });
        break;
      default:
        break;
    }
  }

  if (target.type === 'FIXED') {
    return (
      <li
        className={`${selectedTarget === target.pk ? 'selected-target' : ''}`}
        key={`science-target`}
        {...longPressEvent}
      >
        <div className="target-item">
          <span className="target-name" title={target.name ?? undefined}>
            {target.name}
          </span>
          <span className="text-right">{target.az?.dms}</span>
          <span>Az</span>
          <span className="text-right">{target.el?.dms}</span>
          <span>El</span>
        </div>
      </li>
    );
  } else {
    return (
      <li
        className={`${selectedTarget === target.pk ? 'selected-target' : ''}`}
        key={`science-target`}
        {...longPressEvent}
      >
        <div className="target-item">
          <span className="target-name" title={target.name ?? undefined}>
            {target.name}
          </span>
          <span className="text-right">{target.ra?.hms}</span>
          <span>RA</span>
          <span className="text-right">{target.dec?.dms}</span>
          <span>Dec</span>
        </div>
      </li>
    );
  }
}
