import { Accordion as AccordionBase } from '@base-ui-components/react/accordion';

type AccordionRootProps = typeof AccordionBase.Root extends React.ComponentType<
  infer P
>
  ? P
  : never;
export const AccordionBaseRoot = ({
  children,
  ...props
}: AccordionRootProps) => {
  return (
    <AccordionBase.Root {...props}>
      <AccordionBase.Item>{children}</AccordionBase.Item>
    </AccordionBase.Root>
  );
};

type AccordionBaseTriggerProps =
  typeof AccordionBase.Trigger extends React.ComponentType<infer P> ? P : never;
export const AccordionBaseTrigger = ({
  children,
  ...props
}: AccordionBaseTriggerProps) => {
  return (
    <AccordionBase.Header>
      <AccordionBase.Trigger {...props}>{children}</AccordionBase.Trigger>
    </AccordionBase.Header>
  );
};

type AccordionBasePanelProps =
  typeof AccordionBase.Panel extends React.ComponentType<infer P> ? P : never;

export const AccordionBasePanel = ({
  children,
  ...props
}: AccordionBasePanelProps) => {
  return <AccordionBase.Panel {...props}>{children}</AccordionBase.Panel>;
};

const Accordion = Object.assign(AccordionBaseRoot, {
  Trigger: AccordionBaseTrigger,
  Panel: AccordionBasePanel,
});

export default Accordion;
