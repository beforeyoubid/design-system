import type { Meta, StoryObj } from '@storybook/react-vite'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'

const schema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters.'),
})

const meta: Meta = {
  title: 'shadcn/Form',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

function ProfileForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: '' },
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => alert(JSON.stringify(v)))} className="w-80 space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl><Input placeholder="shadcn" {...field} /></FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export const Default: Story = { render: () => <ProfileForm /> }
