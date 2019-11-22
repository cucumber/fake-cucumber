import { performance } from 'perf_hooks'

export default class DurationComputer {
  private readonly started = performance.now()

  public nanos(): number {
    return (performance.now() - this.started) * 1000000
  }
}
