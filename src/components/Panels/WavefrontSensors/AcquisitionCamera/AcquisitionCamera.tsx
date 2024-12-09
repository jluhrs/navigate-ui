import imgUrl from '@assets/underconstruction.png';
import { useAcObserve, useAcStopObserve } from '@gql/server/AcquisitionCamera';
import { useGuideState } from '@gql/server/GuideState';
import { clsx } from 'clsx';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { useCallback, useState } from 'react';

import MainControls from './MainControls';

export default function AcquisitionCamera({ canEdit, ac }: { canEdit: boolean; ac: string }) {
  const [startObserve, { loading: startObserveLoading }] = useAcObserve();
  const [stopObserve, { loading: stopObserveLoading }] = useAcStopObserve();

  const { data: guideStateData, loading: guideStateLoading } = useGuideState();
  const integrating = guideStateData?.acIntegrating;

  const [exp, setExp] = useState(1);

  const onClick = useCallback(
    () =>
      integrating
        ? void stopObserve({})
        : void startObserve({
            variables: { period: { milliseconds: exp * 1000 } },
          }),
    [exp, integrating, startObserve, stopObserve],
  );

  const loading = guideStateLoading || startObserveLoading || stopObserveLoading;

  return (
    <div className="acquisition-camera">
      <div className="left">
        <div className="image">
          <span className="ac-name">{ac}</span>
          <img src={imgUrl} alt="wfs" />
        </div>
        <div className="controls">
          <label htmlFor="exp" style={{ textAlign: 'center', alignSelf: 'center', gridArea: 'g1' }}>
            Exp
          </label>
          <Dropdown
            inputId="exp"
            disabled={!canEdit}
            style={{ gridArea: 'g2' }}
            value={exp}
            onChange={(e) => setExp(e.value as number)}
            options={[
              { label: '0.01', value: 0.01 },
              { label: '0.1', value: 0.1 },
              { label: '1.0', value: 1.0 },
              { label: '10', value: 10 },
            ]}
          />
          <label htmlFor="save" style={{ textAlign: 'center', alignSelf: 'center', gridArea: 'g3' }}>
            Save
          </label>
          <Checkbox
            className="under-construction"
            inputId="save"
            disabled={!canEdit}
            style={{ gridArea: 'g4' }}
            checked={true}
          />

          <Button
            loading={loading}
            disabled={!canEdit}
            style={{ gridArea: 'g5' }}
            icon={clsx('pi', integrating ? 'pi-stop' : 'pi-play')}
            aria-label={integrating ? 'Stop' : 'Start'}
            tooltip={integrating ? 'Stop' : 'Start'}
            onClick={onClick}
          />
          <Button
            className="under-construction"
            disabled={!canEdit}
            style={{ gridArea: 'g6' }}
            icon="pi pi-camera"
            aria-label="Take Sky"
            tooltip="Take Sky"
          />
        </div>
      </div>
      <MainControls canEdit={canEdit} />
    </div>
  );
}
