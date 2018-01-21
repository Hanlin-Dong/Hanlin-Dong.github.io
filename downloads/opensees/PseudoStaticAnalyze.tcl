#############################################################
# file: PseudoStaticAnalyze.tcl
# author: Hanlin DONG
# version: 4.0
# license: MIT License (https://opensource.org/licenses/MIT)
# last update: 2017-09-01 17:00
# (The latest version can be found on http://www.hanlindong.com)
# readme: 
#   This file defines a procedure to make the structure subjected to pseudo-static loading
#   The loading amplitudes are defined in a list
#   The Displacement control can be devided to equally meshed steps or equal number of steps.
#   The initial step is set to be the "maxstep". If convergence fails, a smaller step will be tried.
#   The smaller step is defined by dividing the current step by the relaxation parameter.
#   WARNING: algorithm should be defined before calling the procedure.
# change log:
#   2017-05-17 16:00 v1.0
#     Create file. Test passed.
#   2017-08-26 08:00 v1.1
#     Improve user interface, print every amp during analysis.
#   2017-08-26 16:00 v2.0
#     Change to an iterative procedure.
#     Use private recursive function to realize change of step length.
#     Improve user interface.
#   2017-08-27 10:00 v2.1
#     Review the graph and documentation.
#     Improve user interface.
#   2017-08-27 15:00 v3.0
#     Import a relaxation parameter.
#     For some convergence problems, the iteration step should be really small.
#     This relaxation parameter is aimed to speed up the convergence.
#   2017-08-27 19:00 v3.1
#     Bug fix on the percentage run.
#   2017-09-01 17:00 v4.0
#     Change name to PseudoStaticAnalyze.
#   2017-12-03 19:00 v5.0
#     Discard the recursive function, because sometimes too much nesting causes problems.
#     This time, use while iterations instead.
#############################################################

# Graph:
#     
#         ^ Displacement
#         |              amp1
#         |             /\
#         |  amp0      /  \
#        _| /\        /    \
# maxstep_|/  \      /      \
#         o----\----o--------\--------o----->pseudo-time
#         |     \  / end of   \      / end of
#         |      \/  amp0      \    /  amp1
#         |                     \  /
#         |                      \/


# Args:
# amplist: a list of proposed amplifications.
# maxstep: largest step length (most times equals to the real step length, sometimes not if amp devide by step is not integer)
# minstep: smallest step length (convergence error will be reported if the analyze fail at minstep)
# relaxation: the relaxation parameter. When convergence failed at a certain step, this step is divided by the relaxation parameter.
# node: node tag of displacement controlling point
# dir: direction of displacement control.

puts "PesudoStaticAnalyze v4.0 successfully loaded (Copyright: Hanlin DONG, MIT License) ..."

proc PseudoStaticAnalyze {amplist maxstep minstep relaxation node dir} {
    proc iterativeAnalyze {node dir toldisp currdisp maxstep minstep currstep relaxation} {
        if {[expr abs($currdisp)] >= [expr abs($toldisp)]} {
            puts "Iterating: 100% finished."
            puts "Iteration of node $node at direction $dir dispcontrol $toldisp finished."
            return 0
        } else {
            if {[expr abs($currstep)] < [expr abs($minstep)]} {
                puts "Analyze failed."
                return -1
            } else {
                if {[expr abs($toldisp - $currdisp)] < [expr abs($currstep)]} {
                    set currstep [expr $toldisp - $currdisp]
                }
                puts "Iterating: [format "%.4f" [expr $currdisp * 100.0 / $toldisp]]% finished. current step length: $currstep"
                integrator DisplacementControl $node $dir $currstep
                set flag [analyze 1]
                if {$flag != 0} {
                    set currstep [expr $currstep *1.0 / $relaxation]
                    iterativeAnalyze $node $dir $toldisp $currdisp $maxstep $minstep $currstep $relaxation
                } else {
                    set currdisp [expr $currdisp + $currstep]
                    set currstep $maxstep
                    iterativeAnalyze $node $dir $toldisp $currdisp $maxstep $minstep $currstep $relaxation
                }
            }
        }
    }
    foreach amp $amplist {
        puts "Analyzing amp= $amp ..."
        set ret [iterativeAnalyze $node $dir $amp 0 $maxstep $minstep $maxstep $relaxation]
        if {$ret != 0} {return}
        set ret [iterativeAnalyze $node $dir [expr -2*$amp] 0 [expr -$maxstep] [expr -$minstep] [expr -$maxstep] $relaxation]
        if {$ret != 0} {return}
        set ret [iterativeAnalyze $node $dir $amp 0 $maxstep $minstep $maxstep $relaxation]
        if {$ret != 0} {return}
        puts "Amp= $amp has been done successfully!"
    }
    set msg "Pseudo static loading is successfully analysed using PseudoStaticAnalyze v4.0.
    Control message: node tag: $node, direction: $dir, maxstep: $maxstep, minstep: $minstep
    Amplifications: $amplist"
    puts $msg
    return $msg
}