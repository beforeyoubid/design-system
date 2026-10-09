import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../../components/ui/input-otp'

const meta: Meta<typeof InputOTP> = {
  title: 'BYB Components/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof InputOTP>

const Six = () => (
  <InputOTPGroup>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <InputOTPSlot key={i} index={i} />
    ))}
  </InputOTPGroup>
)

const ThreeThree = () => (
  <>
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </>
)

export const SixDigit: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <Six />
    </InputOTP>
  ),
}

export const Grouped: Story = {
  name: 'Groups [3, 3]',
  render: () => (
    <InputOTP maxLength={6}>
      <ThreeThree />
    </InputOTP>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="otp" className="text-body-sm leading-tight font-semibold text-navy">
        Verification code<span className="ms-0.5 text-mint-45">*</span>
      </label>
      <InputOTP id="otp" maxLength={6}>
        <ThreeThree />
      </InputOTP>
      <span className="text-body-sm text-dark-60">Enter the 6-digit code we sent to 0400 000 000.</span>
    </div>
  ),
}

export const Invalid: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="otp-err" className="text-body-sm leading-tight font-semibold text-navy">
        Verification code
      </label>
      <InputOTP id="otp-err" maxLength={6} defaultValue="123456" aria-invalid>
        <ThreeThree />
      </InputOTP>
      <span role="alert" className="text-body-sm text-error-75">That code is incorrect. Try again.</span>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <InputOTP maxLength={6} defaultValue="482" disabled>
      <ThreeThree />
    </InputOTP>
  ),
}
