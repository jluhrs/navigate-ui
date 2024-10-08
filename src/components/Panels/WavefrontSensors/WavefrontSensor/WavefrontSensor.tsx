import imgUrl from '@assets/underconstruction.png';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { useOiwfsObserve, useOiwfsStopObserve } from '@gql/server/WavefrontSensors';
import { useState } from 'react';

export default function WavefrontSensor({
  canEdit,
  wfs,
  className = '',
}: {
  canEdit: boolean;
  wfs: string;
  className?: string;
}) {
  const [freq, setFreq] = useState(100);
  const [observeState, setObserveState] = useState(false);
  let observeButton;
  const startObserve = useOiwfsObserve();
  const stopObserve = useOiwfsStopObserve();
  if (wfs === 'OIWFS') {
    if (observeState) {
      observeButton = (
        <Button
          disabled={!canEdit}
          style={{ gridArea: 'g13' }}
          icon="pi pi-stop"
          className="p-button-danger"
          aria-label="Stop"
          tooltip="Stop"
          onClick={() =>
            void stopObserve({
              onCompleted() {
                setObserveState(false);
              },
            })
          }
        />
      );
    } else {
      observeButton = (
        <Button
          disabled={!canEdit}
          style={{ gridArea: 'g13' }}
          icon="pi pi-play"
          aria-label="Start"
          tooltip="Start"
          onClick={() =>
            void startObserve({
              variables: { period: { milliseconds: (1 / freq) * 1000 } },
              onCompleted() {
                setObserveState(true);
              },
            })
          }
        />
      );
    }
  } else if (wfs === 'PWFS1') {
    /* Show placeholder */
    observeButton = (
      <Button
        className="under-construction"
        disabled={!canEdit}
        icon="pi pi-play"
        style={{ gridArea: 'g13' }}
        aria-label="Start"
        tooltip="Start"
      />
    );
  } else if (wfs === 'PWFS2') {
    /* Show placeholder */
    observeButton = (
      <Button
        className="under-construction"
        disabled={!canEdit}
        icon="pi pi-play"
        style={{ gridArea: 'g13' }}
        aria-label="Start"
        tooltip="Start"
      />
    );
  }

  return (
    <div className={`wfs ${className}`}>
      <span className="wfs-name">{wfs}</span>
      <img src={imgUrl} alt="wfs" />
      <div className="controls">
        <span style={{ alignSelf: 'center', gridArea: 'g11' }}>Freq</span>
        <Dropdown
          disabled={!canEdit}
          style={{ gridArea: 'g12' }}
          value={freq}
          options={[
            { label: '50', value: 50.0 },
            { label: '100', value: 100.0 },
            { label: '200', value: 200.0 },
          ]}
          onChange={(e) => setFreq(e.value as number)}
        />
        {observeButton}
        <span style={{ alignSelf: 'center', gridArea: 'g21' }}>Save</span>
        <Checkbox disabled={!canEdit} style={{ gridArea: 'g22' }} checked={true} />
        <Button
          disabled={!canEdit}
          style={{ gridArea: 'g23' }}
          icon="pi pi-camera"
          aria-label="Take Sky"
          tooltip="Take Sky"
        />
        <Button disabled={!canEdit} style={{ gridArea: 'g3', width: '97%' }} label="Autoadjust" />
      </div>
    </div>
  );
}
