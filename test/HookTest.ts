import * as messages from '@cucumber/messages'
import { Envelope, HookType } from '@cucumber/messages'
import assert from 'assert'

import Hook from '../src/Hook'
import TestWorld from './TestWorld'

describe('Hook', () => {
  describe('#match', () => {
    it("does not return a SupportCodeExecutor if the hook's tag expression does not match", () => {
      const hook = new Hook(
        'hook-id',
        HookType.BEFORE_TEST_CASE,
        'not @foo',
        null,
        () => {
          throw new Error('unexpected')
        }
      )
      const pickle: messages.Pickle = {
        tags: [{ name: '@foo', astNodeId: '1' }],
        astNodeIds: [],
        id: '1',
        language: 'en',
        name: 'Test',
        steps: [],
        uri: 'uri',
      }
      const executor = hook.match(pickle)

      assert.strictEqual(executor, null)
    })

    it("returns a SupportCodeExecutor if the hook's tag expression matches", () => {
      const hook = new Hook(
        'hook-id',
        HookType.BEFORE_TEST_CASE,
        'not @foo',
        null,
        () => {
          return 'something'
        }
      )
      const pickle: messages.Pickle = {
        tags: [{ name: '@bar', astNodeId: '1' }],
        astNodeIds: [],
        id: '1',
        language: 'en',
        name: 'Test',
        steps: [],
        uri: 'uri',
      }
      const executor = hook.match(pickle)

      assert.strictEqual(executor.execute(new TestWorld()), 'something')
    })

    it('returns a SupportCodeExecutor if the hook has no tag expression', () => {
      const hook = new Hook(
        'hook-id',
        HookType.BEFORE_TEST_CASE,
        null,
        null,
        () => {
          return 'something'
        }
      )
      const pickle: messages.Pickle = {
        tags: [{ name: '@bar', astNodeId: '1' }],
        astNodeIds: [],
        id: '1',
        language: 'en',
        name: 'Test',
        steps: [],
        uri: 'uri',
      }
      const executor = hook.match(pickle)

      assert.strictEqual(executor.execute(new TestWorld()), 'something')
    })
  })

  describe('#toMessage', () => {
    it('converts to hook message', () => {
      const hook = new Hook(
        'hook-id',
        HookType.BEFORE_TEST_CASE,
        null,
        { uri: '/some/file.ts' },
        () => {
          return 'something'
        }
      )

      assert.deepStrictEqual<Envelope>(hook.toMessage(), {
        hook: {
          id: 'hook-id',
          type: HookType.BEFORE_TEST_CASE,
          sourceReference: { uri: '/some/file.ts' },
        },
      })
    })
  })
})
