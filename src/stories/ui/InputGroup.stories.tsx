import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  IconSearch,
  IconMail,
  IconCopy,
  IconEye,
  IconPaperclip,
  IconSend,
} from '@tabler/icons-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '../../components/ui/input-group'
import { Spinner } from '../../components/ui/spinner'

const meta: Meta<typeof InputGroup> = {
  title: 'BYB Components/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof InputGroup>

export const LeadingIcon: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon align="inline-start">
        <IconSearch />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search address…" />
    </InputGroup>
  ),
}

export const TrailingIcon: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupInput placeholder="you@example.com" />
      <InputGroupAddon align="inline-end">
        <IconMail />
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const PrefixSuffix: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="beforeyoubuy.com.au" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" inputMode="decimal" />
        <InputGroupAddon align="inline-end">AUD</InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

export const WithButton: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Promo code" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="primary">Apply</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="you@example.com" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="secondary">Subscribe</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput defaultValue="https://byb.link/r/3fk2" readOnly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="tertiary">
            <IconCopy />
            Copy
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput type="password" placeholder="Password" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Show password">
            <IconEye />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon>
        <IconSearch />
      </InputGroupAddon>
      <InputGroupInput defaultValue="12 Smith St" />
      <InputGroupAddon align="inline-end">
        <Spinner size="md" />
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const TextareaWithFooter: Story = {
  render: () => (
    <InputGroup className="w-96">
      <InputGroupTextarea rows={3} placeholder="Ask a question about this report…" />
      <InputGroupAddon align="block-end" className="justify-between">
        <InputGroupButton size="icon-xs" aria-label="Attach file">
          <IconPaperclip />
        </InputGroupButton>
        <div className="flex items-center gap-2">
          <InputGroupText className="text-caption text-dark-60">0 / 500</InputGroupText>
          <InputGroupButton variant="primary">
            Send
            <IconSend />
          </InputGroupButton>
        </div>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const Invalid: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon>
        <IconMail />
      </InputGroupAddon>
      <InputGroupInput aria-invalid defaultValue="not-an-email" />
    </InputGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <InputGroup className="w-80" data-disabled="true">
      <InputGroupAddon>
        <IconSearch />
      </InputGroupAddon>
      <InputGroupInput disabled placeholder="Search address…" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="primary" disabled>
          Go
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}
