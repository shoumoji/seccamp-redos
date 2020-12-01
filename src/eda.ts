import { buildStronglyConnectedComponents } from './scc';
import { PrunedNFA, DirectProductGraph, Message } from './types';
import { Attacker } from './attack';

/**
 * 強連結成分を一つ一つ見ていき、EDAを持つかメッセージを返す
 */
export function showMessageEDA(
  pnfa: PrunedNFA,
  dps: DirectProductGraph[],
): Message {
  const attacker = new Attacker(pnfa);

  for (const dp of dps) {
    const sccs = buildStronglyConnectedComponents(dp);
    for (const scc of sccs) {
      const attack = attacker.findExponentialAttack(scc, dp.table);
      if (attack !== null) {
        return { status: 'Vulnerable', message: 'Detected EDA.', attack };
      }
    }
  }

  return { status: 'Safe', message: "Don't have EDA." };
}
