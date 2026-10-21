'use client';
import { useId, useState } from 'react';
import { Select, Alert, Progress, Skeleton, Button, Label } from '@devvy-ui/react';

export function FoundationPreview({ name }: { name: string }) {
  const id = useId();
  const [project, setProject] = useState('orbit');
  const [progress, setProgress] = useState(35);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  if (name === 'select')
    return (
      <form
        className="control-stack foundation-preview"
        onSubmit={(event) => event.preventDefault()}
        onReset={() => setProject('orbit')}
      >
        <div className="field">
          <Label htmlFor={id}>Project</Label>
          <Select
            id={id}
            name="project"
            value={project}
            onChange={(event) => setProject(event.target.value)}
          >
            <optgroup label="Active projects">
              <option value="orbit">Orbit workspace</option>
              <option value="studio">Dev Station studio</option>
            </optgroup>
            <option value="archived" disabled>
              Archived project
            </option>
          </Select>
        </div>
        <p role="status">
          Selected: {project === 'orbit' ? 'Orbit workspace' : 'Dev Station studio'}
        </p>
        <div className="field">
          <Label htmlFor={`${id}-disabled`}>Unavailable plan</Label>
          <Select id={`${id}-disabled`} disabled>
            <option>Enterprise</option>
          </Select>
        </div>
        <Button type="reset" variant="outline">
          Reset selection
        </Button>
      </form>
    );
  if (name === 'alert')
    return (
      <div className="control-stack foundation-preview">
        {!dismissed && (
          <Alert tone="brand">
            <strong>Your changes are saved.</strong>
            <p>You can continue editing this workspace.</p>
          </Alert>
        )}
        <Button variant="outline" onClick={() => setDismissed((value) => !value)}>
          {dismissed ? 'Show message' : 'Dismiss message'}
        </Button>
        <Alert tone="danger" variant="outline" role="note">
          <strong>Review your connection.</strong>
          <p>This static example uses a note. Reserve role="alert" for urgent updates.</p>
        </Alert>
      </div>
    );
  if (name === 'progress')
    return (
      <div className="control-stack foundation-preview">
        <div className="field">
          <p id={id}>Upload · {progress}%</p>
          <Progress label="Upload" aria-describedby={id} value={progress} />
        </div>
        <div className="button-row">
          <Button
            onClick={() => setProgress((value) => Math.min(100, value + 15))}
            disabled={progress === 100}
          >
            Advance upload
          </Button>
          <Button variant="outline" onClick={() => setProgress(0)}>
            Reset progress
          </Button>
        </div>
        <div className="field">
          <p>Waiting for a connection</p>
          <Progress label="Connecting" tone="neutral" />
        </div>
      </div>
    );
  return (
    <div className="control-stack foundation-preview">
      <section aria-busy={loading} aria-label="Profile" className="control-stack">
        {loading ? (
          <>
            <Skeleton variant="circle" />
            <Skeleton width="70%" />
            <Skeleton width="90%" />
            <Skeleton variant="rect" height={80} />
          </>
        ) : (
          <>
            <strong>Orbit workspace</strong>
            <p>Your workspace is ready. Loading shapes have been replaced by real content.</p>
          </>
        )}
      </section>
      <p role="status">{loading ? 'Loading profile' : 'Profile loaded'}</p>
      <Button variant="outline" onClick={() => setLoading((value) => !value)}>
        {loading ? 'Finish loading' : 'Show loading state'}
      </Button>
    </div>
  );
}
